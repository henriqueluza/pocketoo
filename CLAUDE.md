# Projeto da AI Software House

Regras deste repositório (somam-se a `~/.claude/CLAUDE.md` e a `.claude/rules/`).

## Fluxo
- Toda tarefa vem de uma Issue com critérios de aceite. Uma Issue = uma branch = um PR.
- Implementação: skill `implement-issue`. Revisão: skill `review-pr` (dispara os subagentes code-reviewer, security-reviewer, qa-tester e, conforme o diff, ui-reviewer, seo-reviewer, compliance-reviewer e devops-reviewer).
- Revisão em rodadas, como em um time: `changes-requested` → o autor corrige com a skill `address-review` e aplica `re-review` → nova revisão → `review:approved`. `needs-human` é só para decisão que o agente não pode tomar. Autor nunca aplica `review:approved`.
- Padrões de código: skill `engineering-standards` + guia da stack. Arquitetura e nível (`simple`/`clean`/`clean+ddd`) estão no ADR em `docs/architecture/`.
- Ao terminar uma etapa, escreva `docs/handoff/<issue>.md` (estado, decisões, próximo passo, testes pendentes).

## Stack deste projeto
<!-- preenchido pelo project-bootstrap: linguagem, framework, banco, nível de arquitetura, comandos de lint/test/build -->

## Proibido
- Merge em main, deploy, `git push --force`, remover/pular testes para o CI passar, editar `.github/workflows` sem autorização explícita, ler `.env`/segredos.
