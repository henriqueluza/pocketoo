# Discovery — Pocketoo

> Fonte: brief do usuário em 2026-10-29. Itens marcados **não definido** são riscos até serem respondidos.

## 1. Objetivo e problema

Cliente é dona de microempresa de eventos (clientes: grandes empresas e órgãos públicos). Tentou controlar gastos em Excel e achou complexo. Quer, num só app e com o mínimo de esforço:

- ver para onde vai o dinheiro, pessoal (CPF) e da empresa (CNPJ);
- definir limites de gasto e ser avisada;
- planejar gastos para economizar, principalmente nos eventos.

Fase 1: MVP exclusivo da cliente (Android, PT-BR, BRL, Play Store teste interno, uso em até 1 mês).
Fase 2: produto público Android + iOS, assinatura mensal e vitalícia, i18n, multimoeda, Open Finance (estudo), assistência de impostos (ideia).

## 2. Usuários e volume

| Fase | Usuários | Status |
|---|---|---|
| Fase 1 (mês 1) | 1 (cliente). Sócio/contador: **não definido** | brief |
| Fase 2 — 6 meses após lançamento | **não definido** | pendente |
| Fase 2 — 12 meses | **não definido** | pendente |
| Fase 2 — 24 meses | **não definido** | pendente |

Volume de dados por usuária: estimado em 5–30 lançamentos/dia (a confirmar com a planilha real).

## 3. Picos de uso

- Fase 1: nenhum relevante.
- Fase 2: jobs agendados (resumo semanal/mensal, vencimentos) concentrados em horários fixos; campanhas de lançamento nas lojas. Magnitude **não definida**.

## 4. Dados e sensibilidade

- Dados financeiros pessoais e da empresa → LGPD. Alta sensibilidade.
- Áudio de voz: transcrever e descartar; não armazenar arquivo.
- Biometria: só local (API do sistema); o app nunca recebe o dado biométrico.
- Requisitos do brief: criptografia em trânsito e repouso, isolamento por usuário (RLS ou equivalente), minimização, consentimento, política de privacidade e termos, exportação e exclusão de conta, nenhum segredo no app.
- Valores monetários: inteiros em centavos + código ISO 4217.

## 5. Integrações externas

| Integração | Fase | Observação |
|---|---|---|
| Auth + banco na nuvem com sync offline | 1 | decisão técnica nossa |
| Transcrição de áudio (PT-BR) | 1 | decisão nossa; verificar retenção do provedor |
| LLM de baixo custo (categorização, linguagem natural, textos de resumo/estratégia) | 1 | teto de custo mensal; chave só no backend |
| Push notifications | 1 | decisão nossa |
| Google Play Console (teste interno) | 1 | conta paga pelo usuário |
| App Store Connect | 2 | US$ 99/ano |
| Cobrança de assinaturas (Play Billing / StoreKit) | 2 | |
| Open Finance | 2 | estudo de viabilidade (via agregador ou participante regulado) |
| OCR/IA de fatura (foto/PDF) | 2 | avaliar LGPD |

## 6. Mobile, tempo real, assíncrono

- Mobile nativo multiplataforma (um código Android + iOS). Fase 1 só Android.
- Offline-first para registro de gastos, sincronização posterior.
- Assíncrono: jobs agendados (alertas de limite, vencimentos, resumos), chamadas de IA no backend.
- Tempo real entre dispositivos: desejável só se houver mais de um usuário na conta CNPJ (**não definido**).

## 7. Restrições legais/regulatórias

- LGPD (dados financeiros; uso de provedores de IA fora do Brasil = transferência internacional, precisa constar na política).
- Política de apps financeiros da Google Play (declaração de recursos financeiros) e, na Fase 2, regras de assinatura das lojas.
- Fase 2: Open Finance é regulado pelo Bacen; impostos geram responsabilidade sobre orientação fiscal.
- O app não presta consultoria financeira: textos de estratégia precisam de aviso.

## 8. Orçamento

- Fase 1: "poucos reais por mês", pago pela cliente. Teto absoluto em R$: **não definido** (proposta a validar no fechamento).
- Fase 2: **não definido**.
- Custos fixos conhecidos: Google Play US$ 25 (taxa única, usuário); Apple US$ 99/ano (Fase 2).

## 9. Quem paga e duração

- Infra Fase 1: cliente. Conta de desenvolvedor: usuário.
- Infra Fase 2 e titularidade do produto público: **não definido**.
- Duração esperada do projeto: **não definido**.

## Viabilidade do prazo (alerta)

O escopo do MVP completo (offline-first, CPF/CNPJ conectados, cartões com fatura e parcelas, empréstimos/dívidas, recorrentes, limites com alertas, quiz, tutorial, registro por texto livre **e** por áudio, importação .xlsx, resumos com IA, notificações, bloqueio biométrico, exportação/exclusão LGPD), somado a uma etapa de design no Figma com aprovação da cliente, não cabe com segurança em 4 semanas. Ver proposta de marcos na seção de decisões.

## Perguntas para a cliente

1. Regime da empresa (MEI, ME no Simples, outro)? Tem contador?
2. Como separa hoje dinheiro pessoal e da empresa? Tem conta PJ? Paga gastos da empresa com cartão pessoal com que frequência?
3. Quantos cartões de crédito (e de quem: CPF/CNPJ), contas bancárias, empréstimos e dívidas ativos?
4. Quais categorias usa hoje na planilha (enviar a planilha real como amostra, de preferência com dados reais ou anonimizados)?
5. Alguém mais usará a conta da empresa (sócio, funcionário, contador)? Só leitura ou também lança?
6. Quer registrar **entradas** também (pagamento dos eventos, pró-labore, salário), ou só gastos? Sem entradas não dá para mostrar saldo nem "quanto a empresa deve a você" com precisão.
7. Agrupar gastos por evento/projeto faz sentido? Quantos eventos por mês, em média?
8. Órgãos públicos costumam pagar com atraso: quer acompanhar valores a receber? (candidato a v2)
9. Que horário prefere para o lembrete diário de registrar gastos? Resumo semanal em que dia?
10. Modelo e versão do Android do celular dela; e-mail Google que usará como testadora.

## Respostas e decisões

Respostas do usuário em 2026-10-29:

| Tema | Decisão | Consequência / risco |
|---|---|---|
| Prazo Fase 1 | Escopo completo em 4 semanas, risco aceito pelo usuário | **Risco alto.** Exige design aprovado pela cliente até ~dia 5 e respostas da cliente + planilha amostra na semana 1. Se o cronograma escorregar, avisar e propor corte explícito, nunca cortar em silêncio. |
| Conta Google Play / Apple | Pessoal, no CPF do usuário | Teste interno funciona. Para publicar na Fase 2 é preciso teste fechado (regra atual: 12 testadores por 14 dias, confirmar). Com venda/assinatura, a loja exibe nome e endereço do desenvolvedor publicamente (confirmar). Migrar para conta de organização depois exige transferir o app. |
| Paridade Android x iOS (Fase 2) | Paridade total | Um código só; diferenças só em integrações de plataforma. |
| Volume Fase 2 (12 meses) | Expectativa até 1 mil; preparar para até 10 mil | Arquitetura e custo dimensionados para 10 mil; estimar faixas 1k / 10k (e 50k como referência). |
| Teto infra Fase 1 | R$ 50/mês, pago pela cliente | Teto do kill switch de IA/transcrição; alerta de orçamento antes de atingir. |
| Dono e pagador da Fase 2 | Usuário | Contas, domínios e projetos de nuvem devem nascer sob titularidade do usuário, com cobrança da Fase 1 separável (cliente paga). |

Ainda **não definido**: duração esperada do projeto; volumes de 6 e 24 meses; respostas da cliente (seção acima).

Decisões de 2026-10-30:

| Tema | Decisão |
|---|---|
| Nome | **Pocketoo** (lembra "poketto", pronúncia japonesa de "pocket"). Pendente: busca no INPI, classes 9 e 36. |
| Distribuição Fase 1 | Teste interno da Play (o .apk avulso fica como plano B: desde 30/09/2026 o Android exige desenvolvedor verificado no Brasil). |
| Ferramentas de design | Mascotes: skill `ip-as-logo`, rodada pelo Codex logado no ChatGPT do usuário (cota do plano, sem API). Logo: skill `logo-design` (SVG, sem créditos). Workspace local: `~/Trabalho/pocketoo/pocketoo-design`. |
| Animação dos mascotes | Vetor em partes com um esqueleto compartilhado; animação em código (SVG + Reanimated) no MVP; Rive avaliado para a versão das lojas. |

Atualização de 2026-11-04:

| Tema | Situação |
|---|---|
| Design | **Aprovado pela cliente** ("achou perfeito"); aprovação explícita do usuário para seguir ao bootstrap. |
| Entradas (receitas) | **Entram no MVP** (decisão do usuário). Necessárias para reembolso, aporte e retirada CPF↔CNPJ. |
| Planilhas | **Pendentes.** Importador será feito com mapeamento genérico de colunas e ajustado quando a amostra chegar. |
| Regime, separação CPF/CNPJ, cartões/contas/empréstimos, outros usuários da empresa | **Não definidos** (sem resposta). Suposições: modelo aceita vários membros mas a interface é de uma pessoa; categorias iniciais genéricas para evento + pessoais; ela cadastra cartões e contas no app. |

Atualização de 2026-11-18 (brief reenviado; decisões do usuário):

| Tema | Situação |
|---|---|
| Material anterior | **Reaproveitado por decisão do usuário**: valem as respostas de 29/10 a 09/11 (teto de R$ 50/mês, usuário dono da Fase 2, paridade Android/iOS, até 1 mil usuários preparado para 10 mil, conta Play pessoal, entradas no MVP) e a stack do ADR-0001. |
| Repositório | `henriqueluza/pocketoo` não existe mais no GitHub (as 61 Issues foram junto; o quadro `projects/2` continua). O bootstrap recria repositório e Issues a partir destes documentos. |
| Prazo | Dois marcos, contados do novo bootstrap: **M1 15/12/2026** (cliente usando o essencial) e **M2 29/12/2026**. Ver cronograma na proposta de arquitetura, seção 9. |
| Design | O arquivo do Figma passa a ser a **fonte oficial da interface** (o brief de 18/11 substitui a ideia de "design só como conceito"). O Figma tem 8 telas, sem variáveis nem componentes; a etapa de revisão cria as telas e estados que faltam, e o bootstrap cria variáveis/estilos antes de extrair o tema. |
| Mascotes | Um mascote por categoria é **proposto no Figma agora**, no estilo do Tuu, para aprovação do usuário. |
| Respostas da cliente e planilha | **Continuam pendentes.** Seguem as suposições de 04/11 (uma pessoa usando; categorias genéricas de eventos + pessoais; importador com mapeamento genérico de colunas). Risco mantido. |

Ainda **não definido**: duração esperada do projeto; volumes de 6 e 24 meses; todas as perguntas para a cliente (seção acima).
