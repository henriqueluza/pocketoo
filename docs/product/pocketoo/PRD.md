# PRD — Pocketoo (Fase 1, MVP da cliente)

- Status: aprovado (Gate 2, 2026-11-09); revisado em 2026-11-18 com novas datas: M1 15/12 e M2 29/12
- Data: 2026-11-18
- Base: discovery (`docs/discovery/pocketoo.md`), ADR-0001 (aprovado), design aprovado pela cliente em 2026-11-04 (`docs/design/pocketoo.md`). Desde 2026-11-18 o arquivo do Figma é a fonte oficial da interface; a revisão de cobertura está em `docs/design/pocketoo-revisao.md`

## Objetivo

Dar à cliente, dona de uma microempresa de eventos, um jeito rápido e leve de controlar ao mesmo tempo o dinheiro pessoal (CPF) e o da empresa (CNPJ): ver para onde o dinheiro vai, respeitar limites e planejar gastos, principalmente nos eventos, sem a complexidade de uma planilha.

## Métricas de sucesso (primeiros 30 dias de uso)

| Métrica | Meta |
|---|---|
| Cliente usando o app no próprio celular | até 15/12/2026 (ver "Prazo") |
| Tempo para registrar um gasto por texto livre | ≤ 10 s, mediana |
| Lançamentos com categoria sugerida aceita sem edição | ≥ 70% |
| Dias com pelo menos um registro | ≥ 20 de 30 |
| Gastos da empresa pagos com dinheiro pessoal registrados como tal | 100% dos que ela declarar (saldo "a empresa te deve" confiável) |
| Custo de infraestrutura | ≤ R$ 50/mês (esperado R$ 0–5) |
| Incidentes de acesso indevido a dados | 0 |

## Prazo

O repositório e as Issues de 09/11 não existem mais e não há código. Em 18/11 o usuário manteve os dois marcos, contados do novo bootstrap (previsto para 24/11, depois da aprovação do design):

- **Marco 1 — 15/12/2026 (cliente usando):** itens marcados **M1**.
- **Marco 2 — 29/12/2026:** itens marcados **M2**. A importação de planilha depende da amostra da cliente, que ainda não chegou.

Cada dia de atraso na aprovação do design empurra os dois marcos em um dia. O M2 cai na semana do Natal: se a revisão de PRs parar de 24 a 26/12, o M2 vai para 05/01/2027.

## Escopo do MVP (lista fechada)

### Conta, dados e segurança
1. **M1** Cadastro e login (Google e e-mail/senha), dados salvos no Firestore com sync offline.
2. **M1** Bloqueio do app por biometria ou PIN do sistema.
3. **M1** Consentimento LGPD no primeiro acesso; política de privacidade e termos publicados.
4. **M2** Exportar meus dados (JSON + CSV) e excluir conta com todos os dados.

### Modos CPF e CNPJ
5. **M1** Dois espaços (Pessoal e Empresa) com alternância visível e visual diferente por modo (cor, tipografia dos títulos, presença do mascote).
6. **M1** Contas e meios de pagamento por espaço: conta, carteira/dinheiro, Pix, débito, cartão de crédito.
7. **M1** Gasto de um espaço pago com conta do outro, com vínculo automático e saldo "a empresa te deve / você deve à empresa".
8. **M1** Acerto do saldo: reembolso, conversão em aporte, e retirada (pró-labore ou distribuição).
9. **M1** Categorias padrão por espaço e categorias personalizadas no modo empresa.
10. **M1** Eventos/projetos no modo empresa, com orçamento e custo realizado.

### Registro (prioridade máxima: rapidez)
11. **M1** Registrar gasto e **entrada** em poucos toques, offline.
12. **M1** Registro por texto livre ("almoço 45 no pix"): parser local no aparelho, com IA como reforço quando há internet; confirmação antes de salvar.
13. **M2** Registro por voz (reconhecimento nativo, texto passa pelo mesmo fluxo do item 12).
14. **M1** Cartões de crédito com fechamento e vencimento; lançamento cai na fatura certa; compras parceladas com parcelas futuras visíveis; fatura preenchida manualmente.
15. **M1** Empréstimos e dívidas com parcelas e vencimentos.
16. **M1** Assinaturas e gastos fixos mensais, com total comprometido no mês e próximas cobranças.

### Limites, metas e inteligência
17. **M1** Limite mensal por categoria e total; alerta do mascote a 80% e ao estourar.
18. **M1** Tela "Gastos do mês" com gráfico de rosca por categoria.
19. **M2** Resumo semanal (gastos da semana + metas da próxima) e resumo mensal.
20. **M2** Estratégias personalizadas por regras + IA de baixo custo, com teto de custo mensal.

### Primeiro uso e ajuda
21. **M1** Quiz inicial que configura categorias, limites iniciais e metas.
22. **M2** Tutorial passo a passo, sempre disponível no menu de ajuda.

### Importação
23. **M2** Importar `.xlsx` (CPF e CNPJ): identificar colunas, sugerir categorias e revisar antes de salvar. Depende da planilha da cliente.

### Notificações
24. **M1** Lembrete diário de registro; limite perto/estourado; parcela, fatura ou dívida vencendo (notificações locais).
25. **M2** Aviso de resumo semanal/mensal disponível (push).

### Visual
26. **M1** Interface fiel ao arquivo do Figma: tema (cores, tipografia, espaçamentos, raios) e componentes extraídos das variáveis e estilos do arquivo; estados vazio, carregando, erro e sem internet em toda tela com dados.
27. **M1** Mascotes: Tuu (marca), a carteira (cartões) e um mascote por categoria padrão, usados nos alertas, resumos, quiz e tutorial. Categoria personalizada usa o quadrado colorido com a inicial.

## Fora de escopo (Fase 1)

- iOS, publicação pública nas lojas, i18n além de pt-BR e multimoeda (o modelo já guarda moeda em cada valor).
- Assinaturas pagas e planos (só a estrutura de flags).
- Open Finance, integração bancária e leitura automática de fatura por foto/PDF.
- Assistência de impostos.
- Motor de estratégias que aprende com o uso (os dados de insights já são guardados para isso).
- Vários usuários usando a mesma empresa ao mesmo tempo (o modelo aceita; a interface não).
- Contas a receber de clientes/órgãos públicos.
- Logos oficiais de serviços na tela de assinaturas (decidir fonte licenciada antes de publicar).

## Épicos

1. **Fundação** — esqueleto do monorepo, CI, ambientes Firebase/EAS, design system extraído do Figma, i18n, Rules com testes. (itens 1–3, 26, 27)
2. **Espaços e lançamentos** — workspaces, contas, categorias, gastos e entradas offline, eventos. (5, 6, 9, 10, 11)
3. **Ponte CPF↔CNPJ** — vínculo automático, saldo e acerto. (7, 8)
4. **Cartões, dívidas e recorrentes** — fatura, parcelas, empréstimos, assinaturas. (14, 15, 16)
5. **Registro inteligente** — parser local, IA nas Functions com kill switch, voz. (12, 13)
6. **Limites e visão do mês** — limites, alertas do mascote, rosca, notificações locais. (17, 18, 24)
7. **Primeiro uso, resumos e ajuda** — quiz, resumos semanal/mensal, estratégias, tutorial, push. (19, 20, 21, 22, 25)
8. **Dados e LGPD** — exportação, exclusão de conta, importação de planilha. (4, 23)

Épico posterior, fora do MVP: **vetorização e animação dos mascotes** (partes separadas para piscar, quicar e acenar). No MVP os mascotes entram como imagem estática.
