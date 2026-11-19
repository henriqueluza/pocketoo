# Handoff — Pocketoo: discovery, design e bootstrap

> Atualizado em 2026-11-18, no fim do bootstrap.

## Estado atual

- O brief foi reenviado em 18/11 e o projeto recomeçou do repositório: `henriqueluza/pocketoo` foi recriado a partir do `project-template` (labels, ruleset `protect-main`, environments, Dependabot). O quadro é https://github.com/users/henriqueluza/projects/2.
- Documentos (este PR): discovery, ADR-0001, C4, proposta de arquitetura com custos, riscos e cronograma, PRD e design.
- Stack mantida: Expo + Firebase/Firestore offline + Cloud Functions + Claude Haiku 5.5. Fase 1 ≈ R$ 0 a 5 por mês, teto de R$ 50.
- Marcos: **M1 em 15/12/2026** (cliente usando) e **M2 em 29/12/2026**.
- Design: o Figma (https://www.figma.com/design/iUmLuJqnfOTH0iayKFTokk) é a fonte oficial. Ele tem 8 telas; as 45 complementares e os 9 mascotes de categoria foram aprovados pelo usuário em 18/11. Capturas das 53 telas em `docs/design/telas/`, mascotes em `docs/design/mascotes/`, tokens em `docs/design/pocketoo.md`, medidas dos componentes em `docs/design/kit.css`.
- Issues #1 a #82 criadas: #1 a #69 para agentes (53 do M1, 16 do M2) e #70 a #82 só do usuário (`needs-human`). Nenhuma tem `agent:authorized`: isso é o Gate 3.

## Decisões tomadas

- 18/11, pelo usuário: reaproveitar o material anterior e a stack; dois marcos; mascotes por categoria gerados no Figma; seguir sem as respostas da cliente; aprovar as 45 telas e os 9 mascotes; o mascote de Lazer é o Sorvete; nome de exemplo Fabiana (nome da cliente).
- Anteriores, mantidas: nome Pocketoo; conta das lojas pessoal no CPF do usuário; usuário dono da Fase 2; paridade Android/iOS; até 1 mil usuários, preparado para 10 mil; teste interno da Play; entradas no MVP; Inter no Android.
- Sem humano, no bootstrap:
  - O grafo de Issues tem três Issues de fundação além do esqueleto (#5 contrato de domínio, #9 componentes base, #12 adapters do Firestore), porque tudo num só PR passaria de 400 linhas. As features dependem delas em vez de depender só da #1.
  - Nas listas e gráficos a categoria usa o quadrado colorido com a inicial; o mascote fica para alertas, resumos, estratégias, avisos e tutorial.
  - A tela de Assinaturas (#37) usa o quadrado da categoria no lugar dos logos de marcas da captura 08.
  - A cor de Compras (`#9CCB3B`) foi tratada como aprovada junto com as telas que a usam.
  - As categorias da empresa saem com a inicial na Fase 1, até decisão em contrário (#79).

## Próximo passo

1. Usuário: merge deste PR de documentos.
2. Usuário: criar a conta Google Play agora (#70) e assinar o Figma (#71).
3. Sessão com Figma, depois do #71: importar as telas e criar variáveis, estilos e componentes (#81). Lotes prontos em `~/Trabalho/pocketoo/pocketoo-design/design/complementos/out/figma-lote-*.html`.
4. `sprint-planning` no repositório (Gate 3) para liberar as Issues do M1; depois, as automações de dispatch e pr-keeper no Orca.

## Só eu posso fazer (tarefas do usuário)

| Issue | Tarefa | Quando |
|---|---|---|
| #70 | Conta Google Play Console e verificação de identidade | Já (caminho crítico do build de 08/12) |
| #71 | Plano Professional do Figma, 1 lugar Full, mensal | Por volta de 20/11 |
| #72 | Projetos Firebase de staging e produção, faturamento e alertas | Antes da Issue #2 |
| #73 | Conta Expo (EAS) e `EXPO_TOKEN` | Antes da Issue #2 |
| #74 | Conta da API da Anthropic, limite, DPA e chave | Antes da Issue #26 |
| #75 | Respostas da cliente, planilha, Gmail de teste, modelo do celular | Planilha até 08/12 |
| #76 | Acordo por escrito com a cliente | Antes da entrega do M1 |
| #77 | Revisar política de privacidade e termos | Antes do M1 |
| #78 | INPI e domínios | Sem data |
| #79 | Mudanças nas telas 01 a 08 e mascotes das categorias da empresa | Antes das Issues #20 e #21 |
| #80 | Enviar o primeiro build ao teste interno e convidar a cliente | 08/12 |
| #81 | Importar as telas no Figma e criar variáveis (em sessão) | Depois do #71 |
| #82 | Vetorizar e animar os mascotes | Depois do MVP |

## Testes pendentes

Nenhum código ainda. Pendentes de verificação: preços do Firestore em São Paulo (calculadora), prazo de retenção da API da Anthropic (#74), regra de 12 testadores por 14 dias da Play para conta pessoal (só na Fase 2).
