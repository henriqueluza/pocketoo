# Projeto da AI Software House

Regras deste repositório (somam-se a `~/.claude/CLAUDE.md` e a `.claude/rules/`).

## Fluxo
- Toda tarefa vem de uma Issue com critérios de aceite. Uma Issue = uma branch = um PR.
- Implementação: skill `implement-issue`. Revisão: skill `review-pr` (dispara os subagentes code-reviewer, security-reviewer, qa-tester e, conforme o diff, ui-reviewer, seo-reviewer, compliance-reviewer e devops-reviewer).
- Revisão em rodadas, como em um time: `changes-requested` → o autor corrige com a skill `address-review` e aplica `re-review` → nova revisão → `review:approved`. `needs-human` é só para decisão que o agente não pode tomar. Autor nunca aplica `review:approved`.
- Padrões de código: skill `engineering-standards` + guia da stack. Arquitetura e nível (`simple`/`clean`/`clean+ddd`) estão no ADR em `docs/architecture/`.
- Ao terminar uma etapa, escreva `docs/handoff/<issue>.md` (estado, decisões, próximo passo, testes pendentes).

## Stack deste projeto
- **Linguagem:** TypeScript em tudo (monorepo com npm workspaces).
- **App (`apps/mobile`):** Expo + React Native + Expo Router, dev build via EAS. Nível **clean** (guia `react-native-expo.md`).
- **Domínio (`packages/domain`):** TypeScript puro com as regras de dinheiro (Money, fatura, parcelas, limites, livro CPF↔CNPJ). Nível **clean**; não importa React Native, Expo, Firebase nem SDKs.
- **Backend (`functions/`):** Cloud Functions for Firebase 2ª geração (Node + TS), `southamerica-east1`. Nível **simple**.
- **Banco:** Cloud Firestore com persistência offline nativa (`@react-native-firebase`); Rules com testes no Emulator.
- **IA:** Claude Haiku 5.5 (`claude-haiku-5-5`) via `@anthropic-ai/sdk`, só nas Functions, com kill switch de custo.
- **Hospedagem:** Firebase `pocketoo-staging` e `pocketoo-prod` + Expo EAS (`preview` = staging, `production` = disparo manual). Envio à Play sempre humano.
- **Decisões:** `docs/architecture/pocketoo/ADR-0001-stack.md`. Produto: `docs/product/pocketoo/PRD.md` (Marco 1 em 15/12/2026, Marco 2 em 29/12/2026).
- **Design:** o arquivo do Figma é a fonte oficial da interface. Tokens e regras em `docs/design/pocketoo.md`; capturas das 53 telas em `docs/design/telas/` (toda Issue de tela cita o número); mascotes em `docs/design/mascotes/`; medidas dos componentes em `docs/design/kit.css`. Não invente tela, cor ou componente: se faltar algo, registre no PR e siga o componente mais próximo.
- **Comandos de qualidade** (configurados na Issue de esqueleto e CI):
  - `npx prettier --check .`
  - `npx eslint .` (inclui `eslint-plugin-boundaries`, o teste de arquitetura)
  - `npx tsc --noEmit` em cada workspace
  - `npx jest --ci`
  - `npm run test:rules` (Firestore Rules no Emulator)
  - `npx expo-doctor` e `npx expo export --platform android` em `apps/mobile`

## Proibido
- Merge em main, deploy, `git push --force`, remover/pular testes para o CI passar, editar `.github/workflows` sem autorização explícita, ler `.env`/segredos.
