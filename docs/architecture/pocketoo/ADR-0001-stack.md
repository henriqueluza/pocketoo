# ADR-0001 — Stack, arquitetura e hospedagem do Pocketoo

- Status: aprovado (Gate 1, 2026-11-09); mantido sem mudança de stack na revisão de 2026-11-18
- Data: 2026-11-04
- Base: `docs/discovery/pocketoo.md`, `docs/architecture/pocketoo/proposta-arquitetura.md`, `docs/design/pocketoo.md`

## Contexto

App de finanças para uma pessoa controlar ao mesmo tempo gastos pessoais (CPF) e da microempresa (CNPJ). Fase 1: Android, exclusivo da cliente, em uso até 15/12/2026 (M1) e escopo completo em 29/12/2026 (M2), conforme a revisão de 2026-11-18, infra até R$ 50/mês. Fase 2: produto público Android + iOS com paridade, assinatura, i18n, multimoeda; até 1 mil usuários em 12 meses, preparado para 10 mil.

Requisitos que mais pesam na decisão:
- **Offline-first**: registrar gasto sem internet e sincronizar depois.
- **Regras de dinheiro com invariantes**: fatura pelo fechamento do cartão, parcelas, limites, saldo CPF↔CNPJ (reembolso, aporte, retirada), entradas.
- **Dados financeiros sob LGPD**; nenhum segredo no app.
- **IA de baixo custo** com teto mensal.
- Um código para Android e iOS.

### Architecture board (5 perspectivas)

1. **Produto.** O problema está bem definido e a cliente aprovou o design. O escopo completo em 4 semanas é o maior risco; mitigação: fatias pequenas em paralelo, checkpoint semanal e corte explícito (nunca silencioso). Pendências da cliente (planilha, regime, outros usuários) não bloqueiam a arquitetura: o modelo já aceita vários membros por workspace e o importador nasce com mapeamento genérico de colunas.
2. **Dados.** Documentos por workspace (pessoal/empresa) com transações, contas, cartões, faturas, recorrentes, dívidas, limites e agregados mensais; livro de vínculos CPF↔CNPJ. Volume pequeno (≈ 5–30 lançamentos/dia por pessoa). Consistência eventual é aceitável para sync entre aparelhos (uma pessoa); invariantes de dinheiro são garantidas no domínio (cálculo determinístico no cliente e revalidação nas Functions/Rules). Valores sempre `amountMinor` inteiro + `currency` ISO 4217.
3. **Infraestrutura.** Firebase (Auth, Firestore, Functions, FCM, Hosting, Remote Config, App Check, Crashlytics) + Expo EAS. Custo estimado (detalhe na proposta de arquitetura): Fase 1 R$ 0–5/mês; 1 mil MAU ≈ R$ 220–440; 10 mil MAU ≈ R$ 2,0–3,2 mil. Gatilho de reavaliação: Firestore acima de US$ 300/mês.
4. **Segurança/compliance.** Ver seção Segurança.
5. **Manutenibilidade.** TypeScript de ponta a ponta (app, Functions e domínio compartilhado); Expo e Firebase são stacks já conhecidas pela casa (guia `react-native-expo.md`; Firebase em uso no portfólio). Regras de dinheiro isoladas em pacote puro e testadas sem infraestrutura, o que reduz a curva para quem vier depois.

## Decisão

### Stack

| Componente | Escolha |
|---|---|
| App | Expo (SDK estável atual) + React Native + TypeScript + Expo Router; dev build via EAS (sem Expo Go) |
| Dados e sync | Cloud Firestore com persistência offline nativa (`@react-native-firebase/firestore`), região `southamerica-east1` |
| Auth | Firebase Auth: Google Sign-In e e-mail/senha (mínimo 8 caracteres, proteção contra enumeração de e-mail ligada) |
| Backend | Cloud Functions for Firebase 2ª geração, Node + TypeScript, `southamerica-east1`; chamáveis com App Check e agendadas (Cloud Scheduler) |
| Domínio compartilhado | `packages/domain` em TypeScript puro, usado pelo app e pelas Functions |
| IA | Claude Haiku 5.5 (`claude-haiku-5-5`) via SDK oficial `@anthropic-ai/sdk`, só nas Functions; saída estruturada validada |
| Voz | Reconhecimento de fala nativo do aparelho (biblioteca a escolher na Issue, com `supply-chain-risk-auditor`); áudio nunca sai do aparelho |
| Notificações | Locais agendadas (`expo-notifications`) para lembretes, vencimentos e limites; FCM para "resumo pronto" |
| Bloqueio | `expo-local-authentication` (biometria ou PIN/padrão do sistema) |
| Planilhas | Leitura de `.xlsx` no aparelho (SheetJS pela distribuição oficial, não o pacote `xlsx` desatualizado do npm) |
| Flags e planos | Remote Config + documento `entitlements/{uid}` escrito só pelo backend |
| i18n | i18next + `expo-localization`, só `pt-BR` agora; dinheiro via `Intl.NumberFormat` |
| Fonte | Inter no Android (OFL); fonte do sistema (SF) no iOS na Fase 2. O Figma usa SF Pro e SF Pro Rounded, cuja licença não cobre Android: é a única divergência aceita entre código e Figma. Títulos do modo pessoal: a decidir na revisão do design (substituta arredondada com licença aberta) |
| Testes | Jest (`jest-expo`) no app e no domínio; `@testing-library/react-native`; `@firebase/rules-unit-testing` no Emulator; Maestro para E2E dos fluxos críticos |

**Desvio do padrão do portfólio (NestJS + Firebase):** mantemos Firebase, sem NestJS. São poucas funções pequenas; um servidor NestJS exigiria Cloud Run com custo fixo ou cold start, sem ganho. Se a Fase 2 trouxer uma API própria (Open Finance, por exemplo), NestJS entra com novo ADR.

### Nível de arquitetura

| Componente | Nível | Justificativa (tabela de proporcionalidade) |
|---|---|---|
| `apps/mobile` | **clean** | Regras de negócio reais, offline, integrações (voz, notificações, biometria), vida útil > 1 ano. |
| `packages/domain` | **clean** (núcleo do app e das Functions), com `Money` como value object e invariantes testadas | Há dinheiro e invariantes, o que puxaria `clean+ddd`; não adotamos DDD tático completo porque há uma pessoa, poucos agregados e prazo de 4 semanas. Reavaliar no ADR da Fase 2 (multiusuário, planos). |
| `functions` | **simple** | Handlers finos que validam entrada, chamam o domínio e adapters (Firestore, Anthropic). |

### Estrutura de pastas (monorepo com npm workspaces)

```
apps/mobile/
  app/                       # Expo Router: só rotas e layouts
  src/features/<feature>/    # ui/ hooks/ application/ storage/ model/ index.ts
  src/shared/                # ui (design system), lib (i18n, formatadores), config
packages/domain/             # Money, ciclo de fatura, parcelas, limites, livro CPF↔CNPJ (TS puro)
functions/src/               # handlers + adapters (firestore, anthropic) + aiBudgetGuard
firestore.rules, firestore.indexes.json, firebase.json, .firebaserc
```

Features previstas: `auth`, `workspaces`, `transactions`, `cards`, `recurring`, `debts`, `limits`, `quick-entry`, `onboarding`, `summaries`, `import`, `settings`.

### Teste de arquitetura

- `eslint-plugin-boundaries` com as regras da seção 4 do guia (rotas → features/shared; feature só importa a si mesma e shared).
- `no-restricted-imports`: `features/*/application/**`, `features/*/model/**` e `packages/domain/**` não importam `react-native`, `expo-*`, `@react-native-firebase/*`, `firebase-*` nem `@anthropic-ai/*`.
- Rodam no job `validate` (`npx eslint .`).

### Hospedagem e ambientes

| Componente | Local | Staging | Production |
|---|---|---|---|
| Firestore, Auth, Functions, Hosting, FCM, Remote Config | Emulator Suite | projeto Firebase `pocketoo-staging` | projeto Firebase `pocketoo-prod` |
| App | dev client (`eas build --profile development`) | EAS `preview` (build interno + canal OTA `preview`) | EAS `production` (canal `production`); envio à Play (teste interno) **só por humano** |

- **Deploy**: staging automático após merge em `main`; produção só por `workflow_dispatch` humano com `environment: production` restrito a `main`, mesmo commit/artefato. Deploy sempre com `--only` e projeto explícito.
- **Autenticação do CI**: Workload Identity Federation do Google Cloud (OIDC, `google-github-actions/auth`) com service account de deploy por projeto; `EXPO_TOKEN` como secret do GitHub Environment.
- **Banco**: Firestore gerenciado (Standard edition, banco `(default)` para usar a cota gratuita). Backup: export agendado diário do Firestore de produção para um bucket GCS com retenção de 30 dias.
- **Segredos**: chave da Anthropic no Secret Manager de cada projeto (`defineSecret`), definida por humano; nada em `EXPO_PUBLIC_*`, `.env` commitado ou código.
- **Custo**: alertas de orçamento no Cloud Billing (R$ 25 e R$ 45) e kill switch próprio de IA (US$ 3/mês na Fase 1); `maxInstances` baixo nas Functions.
- **Rollback**: Functions, Rules e índices pelo workflow de produção disparado por humano com o commit anterior; app JS por EAS Update republicando o update anterior no canal `production`; binário pela Play (interromper o rollout e voltar ao build anterior). Runbook em `docs/runbooks/rollback.md`.

## Segurança

### Ativos

Dados financeiros e pessoais da cliente (transações, contas, cartões, metas, respostas do quiz); sessões e tokens de Auth; chave e orçamento da API da Anthropic; integridade dos saldos (fatura, CPF↔CNPJ).

### Superfícies de ataque

Firebase Auth; Firestore acessado direto pelo cliente (Rules são o controle de acesso); Functions chamáveis; texto livre e descrições de planilha enviados ao LLM; arquivo `.xlsx` importado; cache local e notificações no aparelho; dependências npm e nativas.

### Principais ameaças e mitigação

| # | Ameaça | Mitigação prevista |
|---|---|---|
| 1 | Acesso a dados de outro usuário ou workspace (A01 Broken Access Control / IDOR) | Rules deny-by-default; leitura e escrita só se `request.auth.uid` está em `members`; validação de tipos e campos protegidos (`entitlements`, `insights`, agregados escritos pelo backend); testes de Rules no Emulator no CI (dono, outro usuário, anônimo, campo protegido). |
| 2 | Abuso das Functions e da IA para gerar custo (LLM06 Unbounded Consumption) | App Check com enforcement, Auth obrigatório, limite por usuário por dia, teto de tokens por chamada, kill switch mensal e alertas de orçamento. |
| 3 | Prompt injection por descrições digitadas ou importadas, e saída da IA usada sem validar (LLM01 Prompt Injection, LLM10 Improper Output Handling) | O modelo não tem ferramentas nem acesso a dados além do texto enviado; conteúdo do usuário cercado como dado; saída em JSON validada por schema (zod) e categoria só de uma lista permitida; a usuária confirma antes de salvar; nada da saída vira consulta, HTML ou comando. |
| 4 | Exposição de dados no aparelho perdido, compartilhado ou na tela de bloqueio (A04/A06) | Bloqueio por biometria ou PIN do sistema; tokens em `expo-secure-store`; notificações sem valores por padrão (opção para mostrar); sem dados financeiros em logs ou Crashlytics; exclusão de conta limpa o cache local. |
| 5 | Arquivo `.xlsx` malicioso ou enorme, e exportação CSV com fórmulas (A05 Injection, A10 Mishandling of Exceptional Conditions) | Limite de tamanho e de linhas; parse em try/catch com erro claro; células tratadas como texto; revisão antes de salvar; CSV exportado escapa `=`, `+`, `-`, `@` no início da célula. |

### LGPD

Minimização (só o necessário para o app funcionar); consentimento versionado no onboarding; política de privacidade e termos no Hosting (revisão humana, de preferência jurídica); exportação de dados (JSON + CSV) e exclusão de conta idempotente (Firestore, Auth, insights); transferência internacional declarada (Firebase Auth e API da Anthropic nos EUA; dados do Firestore no Brasil); DPA com a Anthropic e retenção da API conferida antes de publicar; áudio nunca armazenado nem enviado.

### Supply chain

Toda dependência nova passa por `supply-chain-risk-auditor`; dependências nativas com `npx expo install`; lockfile commitado; actions pinadas por SHA.

## Alternativas consideradas

- **Supabase (Postgres + RLS) + camada offline (PowerSync):** melhor para relatórios e custo previsível em escala; descartado na Fase 1 porque o plano gratuito pausa após 7 dias sem uso, o Pro (US$ 25/mês) estoura o teto de R$ 50 e o offline custaria 1–2 semanas a mais.
- **Flutter:** bom para animações e render consistente; descartado por exigir duas linguagens (Dart no app, TS no backend), duplicando as regras de dinheiro, e por suporte mais fraco a `.xlsx`.
- **.NET + PostgreSQL (padrão do portfólio):** exigiria hospedagem paga e sync offline feito à mão; inviável no prazo e no orçamento.
- **NestJS no backend:** ver "Desvio do padrão do portfólio".
- **Transcrição na nuvem (Whisper/STT pago):** descartada na Fase 1; o reconhecimento nativo é gratuito, funciona offline e não envia áudio.

## Consequências

- (+) Offline pronto, custo quase zero na Fase 1, uma linguagem em tudo, regras de dinheiro testáveis sem infraestrutura.
- (+) Pronto para a Fase 2: multiusuário (`members`), i18n, multimoeda (`currency` em todo valor), planos (Remote Config + `entitlements`).
- (−) Lock-in no Firestore e custo de leitura que cresce com o uso; mitigado por repositórios como portas e agregados mensais, com gatilho de reavaliação.
- (−) Relatórios complexos ficam limitados no Firestore; para a Fase 2, avaliar export para BigQuery.
- (−) Dev build obrigatório (sem Expo Go), o que exige EAS desde a primeira semana.
- Pendências que não bloqueiam: planilha da cliente (afeta só o importador e as categorias iniciais) e versões exatas das bibliotecas (confirmadas no Context7 em cada Issue).
