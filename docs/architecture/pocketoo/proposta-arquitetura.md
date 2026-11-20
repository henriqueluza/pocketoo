# Pocketoo — Proposta de arquitetura, custos, riscos e cronograma

> Proposta do discovery (2026-10-29), revisada em 2026-11-18 (riscos, cronograma e avaliações da Fase 2). A decisão final está no ADR-0001; este documento guarda as estimativas de custo e o detalhe do modelo de dados.
> Base: `docs/discovery/pocketoo.md`. Câmbio usado nas estimativas: US$ 1 = R$ 5,50.

## 1. Resumo da decisão

| Camada | Escolha | Por quê |
|---|---|---|
| App | **Expo (React Native) + TypeScript + Expo Router**, build com EAS (dev build) | Um código Android + iOS; stack com guia na casa (`react-native-expo.md`); OTA updates para corrigir rápido na Fase 1. |
| Dados + sync offline | **Cloud Firestore** via `@react-native-firebase` (persistência offline nativa), região `southamerica-east1` | O offline-first vem pronto: escreve local, sincroniza depois, sobrevive a reinício do app. Com o prazo da Fase 1 é o fator decisivo. Dados no Brasil. |
| Auth | **Firebase Auth** (Google Sign-In + e-mail/senha) | Grátis até 50 mil MAU; integra com as regras de segurança do Firestore. |
| Backend | **Cloud Functions for Firebase (2ª geração, Node/TS)**, mesma região | Poucas funções (IA, resumos, exportação, exclusão). Free tier cobre a Fase 1. Sem servidor sempre ligado. |
| IA (texto) | **Claude Haiku 5.5** (`claude-haiku-5-5`, US$ 0,10 / 0,50 por MTok) via API da Anthropic, chamado só pelo backend | Barato o bastante para categorizar e escrever resumos em PT-BR. Saída estruturada (JSON validado). |
| Transcrição de áudio | **Reconhecimento de voz nativo do aparelho** (Android SpeechRecognizer / iOS Speech) | Custo zero, sem upload de arquivo, áudio nunca é armazenado. Fallback: digitar. |
| Notificações | **Locais agendadas** (lembrete diário, vencimentos, alerta de limite) + **FCM** (resumo pronto) | As locais funcionam offline e custam zero; o FCM é gratuito. |
| Bloqueio | Biometria ou PIN/padrão **do sistema** (`expo-local-authentication`) | O dado biométrico nunca sai do aparelho; dispensa a gestão de um PIN próprio. |
| Flags e planos | Firebase Remote Config + doc `entitlements/{uid}` | Prepara os planos da Fase 2 sem implementar cobrança agora. |
| Páginas legais | Firebase Hosting (política de privacidade, termos) | A Play exige URL pública; o subdomínio gratuito serve. |
| Erros | Crashlytics, sem PII | Gratuito. |

**Desvio do padrão do portfólio (NestJS + Firebase):** mantemos o Firebase, mas sem NestJS. Com seis funções pequenas, um servidor NestJS exigiria Cloud Run (custo fixo ou cold start) sem benefício. Se a Fase 2 trouxer uma API própria (Open Finance, por exemplo), o NestJS entra nesse momento, com novo ADR.

**Alternativa avaliada e descartada para a Fase 1: Supabase (Postgres + RLS).** Modelo relacional melhor para relatórios e custo mais previsível em escala, mas: (a) o plano gratuito pausa o projeto após 7 dias sem requisições, e o Pro custa US$ 25/mês (~R$ 140), acima do teto de R$ 50; (b) o offline-first exigiria uma camada extra (PowerSync ou equivalente) e mais 1 a 2 semanas. Ela volta à mesa se a Fase 2 passar de ~10 mil MAU com custo de leitura alto (ver seção 6).

## 2. Visão de componentes

```
App Expo (Android; iOS na Fase 2)
 ├─ domain (TS puro)       Money, ciclo de fatura, parcelas, limites, livro CPF↔CNPJ
 ├─ application            casos de uso: registrar gasto, fechar fatura, checar limite…
 ├─ infrastructure         adapters: Firestore, Auth, notificações locais, voz, xlsx
 └─ ui                     telas, tema CPF/CNPJ, mascotes
        │  Firestore SDK (cache offline)        │ callable HTTPS + App Check
        ▼                                       ▼
 Firestore (southamerica-east1) ◄──── Cloud Functions (southamerica-east1)
   regras: acesso só a workspaces                ├─ categorize / parseEntry (fallback IA)
   onde uid ∈ members                            ├─ weeklySummary / monthlySummary (agendadas)
                                                 ├─ exportData / deleteAccount (LGPD)
                                                 └─ aiBudgetGuard (kill switch)
                                                        │ só texto mínimo, sem identificadores
                                                        ▼
                                                 API Anthropic (Claude Haiku 5.5)
```

**Nível de arquitetura proposto:** app `clean` (financeiro, offline, regras locais, como prevê o guia Expo), com `Money` como value object e invariantes testadas no domínio; funções `simple`. O `clean+ddd` completo não se paga para um único agregado relevante. A decisão final fica no ADR do bootstrap.

**Regras de domínio rodam no aparelho** (offline): fatura correta pela data de fechamento, geração de parcelas, cálculo de limites e alertas e saldo entre CPF e CNPJ. O backend não é necessário para registrar nada.

**Registro em linguagem natural** em duas etapas: (1) parser local determinístico (valor, forma de pagamento, parcelas, palavras-chave de categoria, histórico da própria usuária), instantâneo e offline; (2) só quando a confiança é baixa e há internet, chamada à função `parseEntry`. A usuária sempre confirma antes de salvar.

## 3. Modelo de dados (essencial)

```
users/{uid}                      perfil mínimo, locale, moeda preferida, consentimentos (versão + data)
entitlements/{uid}               plano: "founder" | "free" | …   (escrita só pelo backend)
workspaces/{wid}                 type: personal|business, name, baseCurrency: "BRL", members: {uid: role}
  accounts/{id}                  conta, carteira, cartão (closingDay, dueDay, limitMinor)
  categories/{id}                nome, mascote, cor, customizada?
  projects/{id}                  evento/projeto (business)
  transactions/{id}              kind: expense|income|transfer, amountMinor:int, currency,
                                 date, categoryId, accountId, projectId?, installment {n, of, groupId}?,
                                 invoiceId?, recurringId?, crossWorkspace {fundingWorkspaceId, linkId}?
  invoices/{id}                  fatura por cartão/mês, total, status
  recurring/{id}                 assinaturas e gastos fixos
  debts/{id}                     empréstimos e dívidas com cronograma
  budgets/{yyyy-mm}              limites por categoria e total
  monthlyAggregates/{yyyy-mm}    totais por categoria (alimentam o dashboard sem varrer transações)
links/{id}                       livro CPF↔CNPJ (ver abaixo), visível aos dois workspaces
insights/{uid}/items/{id}        resumos e estratégias gerados + feedback (base para o motor da v2)
```

- Dinheiro: sempre `amountMinor` inteiro (centavos) + `currency` ISO 4217. Nada de float.
- Multiusuário e Fase 2: `members` já existe; na Fase 1 há só uma pessoa, mas as regras de segurança já checam o papel.
- i18n: todas as strings via i18next desde o primeiro dia, só com `pt-BR` agora.
- `insights` guarda entrada, saída e reação da usuária: é o dado de treino do "motor que aprende" da v2.

### Modelo CPF ↔ CNPJ (proposta a validar com a cliente)

Cada lançamento pertence a **quem teve o gasto** (workspace) e sai de **uma conta** (que pode ser do outro workspace).

| Situação | O que o app registra | Efeito no saldo "empresa deve a você" |
|---|---|---|
| Gasto da empresa pago com cartão/conta pessoal | despesa no CNPJ + link `reimbursable` | **+ valor** |
| Empresa devolve o dinheiro | link `reimbursement` | − valor |
| Ela decide não cobrar e tratar como investimento | converte o link em `capital_contribution` (aporte) | − valor (vira aporte acumulado) |
| Empresa paga pró-labore ou distribui lucro | link `withdrawal` (receita no CPF, saída no CNPJ) | não altera; aparece em "retiradas" |
| Gasto pessoal pago com dinheiro da empresa | despesa no CPF + link `reimbursable` invertido | **− valor** (você deve à empresa) |

Na tela: um cartão "A empresa te deve R$ X" com histórico, e um botão "acertar" que gera o reembolso ou converte em aporte. **Depende da pergunta 6 (registrar entradas):** sem entradas, reembolso e retirada não fecham. Por isso a recomendação é ter entradas simples já no MVP.

## 4. Segurança e LGPD

- Regras do Firestore: leitura e escrita só em `workspaces` onde `request.auth.uid` está em `members`; validação de tipos (`amountMinor` inteiro, `currency` em lista); `entitlements` e `insights` só escritos pelo backend. Testes de regras no emulador desde a primeira Issue.
- App Check obrigatório nas Functions (bloqueia chamadas fora do app e protege o orçamento de IA).
- Chave da Anthropic só no Secret Manager; o app não tem segredo.
- Para a IA vai só o necessário: descrição do lançamento, valor, categorias candidatas, sem nome, e-mail, CPF/CNPJ ou IDs. Nada é logado com conteúdo financeiro.
- Áudio: transcrito no aparelho; o app recebe só o texto.
- Criptografia: TLS em trânsito; Firestore criptografa em repouso; o cache local fica no sandbox do app (criptografia de arquivo do Android) e é protegido pelo bloqueio do app. Exclusão de conta apaga o cache local.
- Transferência internacional a declarar na política: Firebase Auth (EUA) e API da Anthropic (EUA). Pela política de dados comerciais da Anthropic, os dados da API não são usados para treino e são retidos por prazo limitado (**confirmar o prazo vigente e assinar o DPA antes de publicar**).
- Direitos do titular: `exportData` (JSON + CSV) e `deleteAccount` (apaga Firestore, Auth e insights; idempotente).
- Consentimento versionado no onboarding; política e termos no Hosting.
- Sugestões financeiras com aviso: "não é consultoria financeira".
- Dependências: `supply-chain-risk-auditor` antes de cada adição. Atenção ao **SheetJS**: o pacote `xlsx` no npm está desatualizado; instalar pela distribuição oficial. O `.xlsx` é lido no aparelho e não sobe para a nuvem.

## 5. Custo mensal — Fase 1 (só a cliente)

| Item | Estimativa |
|---|---|
| Firestore, Auth, Functions, FCM, Hosting, Crashlytics, Remote Config (dentro das cotas gratuitas, plano Blaze) | R$ 0 |
| Resíduos de deploy (Artifact Registry / Cloud Build) | R$ 0–3 |
| Claude Haiku 5.5 (~300 chamadas/mês + 5 resumos) | < R$ 1 |
| Transcrição (nativa) | R$ 0 |
| **Total esperado** | **R$ 0–5/mês** |

- Teto de R$ 50: alerta de orçamento no Google Cloud em R$ 25 e R$ 45 (alerta não bloqueia gasto); kill switch próprio `aiBudgetGuard` que desliga a IA ao atingir US$ 3/mês de consumo. O app continua funcionando sem IA (parser local).
- Taxas únicas ou anuais fora do teto: Google Play US$ 25 (você, uma vez); domínio próprio opcional (~R$ 40/ano).
- O plano Blaze exige cartão no projeto do Firebase. Como você é o dono do produto, proponho o projeto na sua conta Google Cloud, com uma conta de faturamento separada no cartão da cliente para a Fase 1. Na Fase 2 basta trocar a conta de faturamento.

## 6. Custo mensal — Fase 2 (estimativas por faixa de MAU)

Premissas por usuária ativa/mês: ~1.500 gravações, ~20 mil leituras (com cache offline e agregados mensais), ~5 MB de dados/ano e US$ 0,01–0,03 de IA. Preços do Firestore em São Paulo estimados de forma conservadora (≈1,5× a região dos EUA); **confirmar na calculadora do Google Cloud**.

| Item (US$/mês) | 1 mil MAU | 10 mil MAU | 50 mil MAU (referência) |
|---|---|---|---|
| Firestore (leituras dominam) | ~20 | ~235 | ~1.200 |
| IA (Claude Haiku 5.5) | 10–30 | 100–300 | 500–1.500 |
| Functions + Scheduler | ~0 | ~5 | ~30 |
| Auth (até 50 mil MAU) | 0 | 0 | 0 |
| Apple Developer (US$ 99/ano) | ~8 | ~8 | ~8 |
| EAS (opcional, builds mais rápidos) | 0–19 | 19 | 19–99 |
| Assinaturas (RevenueCat: grátis até ~US$ 2,5 mil de receita/mês, depois ~1%; confirmar) | 0 | 0–~25 | variável |
| **Total aproximado** | **US$ 40–80 (R$ 220–440)** | **US$ 370–590 (R$ 2,0–3,2 mil)** | **US$ 1,8–2,9 mil** |

Leitura: a 10 mil MAU, ~250 assinantes a R$ 14,90 (líquido de 15% de taxa da loja) cobrem a infra. Alavancas antes de qualquer migração: limitar a IA no plano gratuito, gerar resumos em lote (Batch API, 50% mais barata) e reduzir leituras com agregados. Se o Firestore passar de ~US$ 300/mês, o domínio isolado em `domain/` e os repositórios como portas permitem migrar a persistência para Postgres sem reescrever regras.

Receita da Fase 2: Google e Apple ficam com 15% das assinaturas (Apple: Small Business Program). O plano vitalício é compra única não consumível.

## 7. Conta Google Play (pessoal, no seu CPF) — o que você precisa fazer

Comece **hoje**: a verificação de identidade pode levar dias e está no caminho crítico.

1. Use (ou crie) uma conta Google dedicada ao desenvolvimento, com verificação em duas etapas.
2. Acesse play.google.com/console, escolha conta **pessoal**, pague US$ 25 (cartão internacional).
3. Envie a verificação de identidade (nome legal, endereço, documento com foto). Desde 30/09/2026 a verificação de desenvolvedor vale para apps instalados em aparelhos Android no Brasil, então distribuir pela Play com conta verificada é o caminho certo (APK avulso teria bloqueio ou espera para a cliente).
4. Verifique e-mail e telefone de contato; se o Console pedir, confirme acesso a um aparelho Android pelo app Play Console.
5. Quando o primeiro build existir (semana 2), eu preparo: criar o app, trilha de **teste interno**, lista de testadoras com o Gmail da cliente, upload do AAB pelo EAS, declarações de privacidade (Data safety), classificação de conteúdo, declaração de recursos financeiros e URL da política de privacidade. Ela instala pelo link de aceite.
6. Fase 2 (conta pessoal): teste fechado com **12 testadores por 14 dias seguidos** antes de pedir acesso à produção. Com venda ou assinatura, a loja exibe seu nome e endereço publicamente. Se isso incomodar, migre antes para uma conta de organização (exige CNPJ + D-U-N-S e transferência do app).

## 8. Riscos (revisados em 2026-11-18)

| # | Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|---|
| 1 | Prazo: M1 em 3 semanas de código e M2 na semana do Natal | Média | Alto | Issues pequenas em paralelo; ponto de controle no fim de cada semana; se escorregar, proponho corte explícito, nunca silencioso. M2 tem data alternativa (05/01). |
| 2 | Aprovação do design depois de 23/11 | Média | Alto | Cada dia de atraso empurra M1 e M2 em um dia. A revisão já entrega os complementos prontos para uma rodada só de ajustes. |
| 3 | Figma sem variáveis nem componentes (camadas convertidas de HTML) | Certa | Médio | O bootstrap cria as variáveis e os estilos no arquivo a partir das telas aprovadas e só então extrai o tema; os valores já estão documentados em `docs/design/pocketoo.md`. |
| 4 | Plano Starter do Figma limita chamadas da integração (limite atingido em 30/10) | Média | Médio | Se o limite voltar durante os complementos, entrego as telas em HTML fiel ao estilo e importo quando o limite renovar; ou o usuário assina um mês do plano pago. |
| 5 | Mascotes por categoria gerados por IA ficarem inconsistentes com o Tuu ou lembrarem personagem existente | Média | Médio | Mesma descrição de estilo para todos; revisão um a um pelo usuário; categoria sem mascote aprovado usa o quadrado com a inicial. |
| 6 | Respostas da cliente e planilha de amostra continuam pendentes | Alta | Médio | Suposições registradas no discovery; importador com mapeamento de colunas e revisão manual; categorias e modelo CPF↔CNPJ ajustáveis sem migração. A planilha precisa chegar até 08/12 para o importador sair no M2. |
| 7 | Texto livre/voz em PT-BR errar valor ou categoria | Média | Médio | Parser local + confirmação antes de salvar; aprende com as correções dela. |
| 8 | Reconhecimento de voz depender dos serviços do aparelho | Baixa | Baixo | Testar no celular dela no primeiro build; fallback de digitação. |
| 9 | Custo de leitura do Firestore e lock-in na Fase 2 | Média | Médio | Agregados mensais, repositórios como portas, gatilho de reavaliação a US$ 300/mês. |
| 10 | Conflitos de sync offline (multiusuário no CNPJ) | Baixa (F1) | Médio | Última escrita vence por documento; lançamentos são imutáveis por padrão (edição gera nova versão). |
| 11 | LGPD: transferência internacional (Auth, IA) | Média | Alto | Declarar na política, DPA com a Anthropic, minimização de dados. |
| 12 | Consumo de IA fora do previsto | Baixa | Médio | Kill switch próprio + App Check + alertas de orçamento. |
| 13 | Sugestão financeira interpretada como consultoria | Baixa | Médio | Aviso explícito; tom de sugestão. |
| 14 | Conta da Play: verificação de identidade demorar ou depender de uma pessoa só | Média | Alto | Criar a conta agora (caminho crítico do primeiro build, em 08/12); 2FA, e-mail de recuperação, acessos documentados. |
| 15 | Logos de serviços de terceiros na tela de Assinaturas | Baixa (F1) | Médio (F2) | Teste interno com uma usuária tem risco baixo; antes de publicar na Fase 2, trocar por fonte licenciada ou ícone genérico por categoria. |

## 9. Cronograma (revisado em 2026-11-18)

| Etapa | Datas | Entregas | Dependências suas/da cliente |
|---|---|---|---|
| Discovery | 18/11 | PRD, escopo MVP x v2, arquitetura, custos, riscos e cronograma revisados | — |
| Revisão do design | 18–23/11 | Lista de cobertura; telas e estados que faltam e mascotes por categoria propostos no mesmo arquivo do Figma | **Sua aprovação explícita até 23/11** |
| Bootstrap | 24–25/11 | Repositório recriado, variáveis e estilos no Figma, tema e componentes especificados, Issues e quadro | Conta Play em verificação; contas Firebase, Expo e Anthropic |
| Semana 1 | 25/11–01/12 | Fundação (CI, ambientes, Rules com testes), design system, auth, bloqueio, espaços Pessoal/Empresa, lançamentos offline | — |
| Semana 2 | 02–08/12 | Cartões, fatura e parcelas; assinaturas e fixos; empréstimos e dívidas; ponte CPF↔CNPJ; registro por texto livre; **primeiro build no teste interno (08/12)** | Gmail e modelo do celular da cliente; planilha até 08/12 |
| Semana 3 | 09–15/12 | Limites e alertas dos mascotes, gastos do mês, eventos, quiz, notificações locais, consentimento, política e termos; **M1 em 15/12** | Feedback da cliente no build; aprovação da política e dos termos |
| Semanas 4 e 5 | 16–29/12 | Voz, importação de planilha, resumos semanal e mensal, estratégias com IA, tutorial e ajuda, push, exportar e excluir conta; **M2 em 29/12** | Aceite final; chave da Anthropic no Secret Manager |

20/11 é feriado nacional. Se a revisão de PRs parar de 24 a 26/12, o M2 vai para 05/01/2027. O bootstrap só começa depois do design aprovado, como pede o brief; a parte que não depende do visual (repositório, CI, ambientes, pacote de domínio) poderia começar antes, se você autorizar, e devolveria 2 a 3 dias ao M1.

## 9.1 Avaliações da Fase 2 pedidas no brief

**Open Finance (viável, via agregador).** O Pocketoo não pode consumir o Open Finance direto: só instituições autorizadas pelo Banco Central participam. O caminho é contratar um agregador que já é participante e expõe contas, cartões e transações por API (há fornecedores no Brasil com esse serviço; preço por conta conectada, **a cotar**). Consequências: exige backend próprio para guardar tokens e receber webhooks (é quando o NestJS entra, com novo ADR); o custo por usuária conectada é recorrente, então a função deve ficar no plano pago; aumenta a responsabilidade LGPD (dados bancários completos, consentimento com prazo e revogação). O modelo de dados da Fase 1 já serve: cada transação importada vira um lançamento com origem `open_finance` e identificador externo para evitar duplicata.

**Assistência de impostos (vale só a versão simples).** Calcular imposto exige regras por regime (MEI, Simples com anexos e faixas, carnê-leão e IRPF na pessoa física), muda todo ano e cria responsabilidade sobre orientação fiscal. Não recomendo. O que vale, com complexidade baixa: lembrete do vencimento do DAS, acompanhamento do faturamento acumulado contra o limite anual do regime (com aviso ao se aproximar), marcação de despesas dedutíveis e um relatório anual para entregar ao contador. Depende de saber o regime da cliente (pergunta ainda aberta) e de conferir os limites e as datas vigentes na época.

**Fatura por foto ou PDF (v2, forma segura).** Riscos: a fatura traz nome, CPF, endereço, número parcial do cartão e todas as compras; enviar a imagem inteira a um provedor de IA é transferência internacional de muito mais dado que o necessário; o arquivo pode conter texto feito para manipular o modelo. Proposta: (1) reconhecer o texto **no aparelho** (ML Kit, gratuito e offline); (2) separar só as linhas de lançamento (data, descrição, valor, parcela) e descartar cabeçalho e dados pessoais; (3) enviar ao modelo apenas essas linhas, como dado, com saída em JSON validado; (4) nunca guardar a imagem ou o PDF, nem em log; (5) a usuária revisa tudo antes de salvar; (6) consentimento específico na primeira vez e limite de tamanho e de páginas. PDF protegido por senha é aberto no aparelho.

## 10. Nome

**Decidido: Pocketoo** (2026-10-30; lembra "poketto", pronúncia japonesa de "pocket"). Lojas, USPTO e web: sem app ou marca com o nome exato. Quase homônimo: "Pocketo" (Google Play, recibos, 10+ downloads). Domínios: .com à venda; .com.br, .io e .co livres; .app provavelmente livre. Pendente: busca no INPI (classes 9 e 36).

### Opções avaliadas no discovery

| Nome | Ideia | Funciona em inglês? |
|---|---|---|
| **Mimo** | Cuidado e carinho com o dinheiro; combina com mascotes | Sim (curto, pronunciável) |
| **Ambi** | De "ambos": pessoal e empresa no mesmo lugar | Sim |
| **Bolsinho** | Bolso pequeno, fofo, muito brasileiro | Não (exigiria outro nome na Fase 2) |
| **Tostão** | Cada tostão conta; mascote natural (moedinha) | Não |
| **Pocket Duo** | Dois bolsos, CPF e CNPJ | Sim, mas menos caloroso em PT |
| **Moni** | Soa como "money", carinhoso | Sim (risco de nomes parecidos) |

Recomendo **Mimo** ou **Ambi**: os dois servem para a Fase 2 internacional, e só eles carregam a identidade "fofinha" e a ideia de duas contas ao mesmo tempo.
