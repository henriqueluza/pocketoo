---
name: ux-laws
description: As 18 leis de UX (Laws of UX, Jon Yablonski) como critério de decisão e de revisão de interface — Fitts, Hick, Jakob, Miller, Tesler, Doherty, Pareto, Parkinson, navalha de Occam, efeito estética-usabilidade, posição serial, Von Restorff, Zeigarnik e as leis de Gestalt (proximidade, similaridade, região comum, conectividade uniforme, Prägnanz). Use ao planejar ou construir qualquer tela, fluxo, formulário, navegação, menu, lista, onboarding, checkout, dashboard ou componente interativo (web e mobile), ao decidir tamanho e posição de alvos, quantidade de opções, agrupamento, ordem de itens, feedback e tempo de resposta, e ao revisar UI (ui-reviewer). Passo obrigatório do protocolo de design.
---

# Leis de UX — 18 leis para decidir e revisar interface

As outras skills de design cuidam de **como a tela parece** (`ui-ux-pro-max`, `design-taste-frontend`, `impeccable`, `unslop-design`). Esta cuida de **como a pessoa pensa e age diante dela**: quanto consegue guardar na cabeça, quanto demora para escolher, onde o dedo alcança, o que ela espera encontrar.

Cada lei abaixo vem com o que fazer, como verificar no código ou na tela renderizada, e o erro comum de interpretação. Lei é heurística com origem em psicologia, não regra de lint: quando duas colidirem, vale a seção "Conflitos".

## Como usar

**Ao construir (antes de escrever a tela):**
1. Diga em uma frase a tarefa principal da tela ("pagar o boleto", "achar um pedido").
2. Na tabela "Por tipo de tela", pegue as leis que mandam naquele tipo. Não tente aplicar as 18 em tudo.
3. Para cada uma, tome a decisão concreta (número de opções, tamanho do alvo, ordem, agrupamento, feedback) antes do código.
4. Depois de implementar, passe o checklist do fim deste arquivo na tela renderizada.
5. Registre no PR (seção Design): `ux-laws: <leis aplicadas> → <decisão tomada>`. Exemplo: `ux-laws: Hick → plano recomendado pré-selecionado, 3 planos em vez de 5 · Fitts → CTA 48px na zona do polegar`.

**Ao revisar (`ui-reviewer`):** rode o checklist sobre cada tela alterada. Achado no formato `[bloqueante|sugestão] tela — lei violada — efeito no usuário — correção`. É bloqueante o que impede ou atrasa a tarefa principal (itens marcados com ★ no checklist); o resto é sugestão.

Projeto com `DESIGN.md`, tokens ou design system: eles mandam em cor, tipo e espaçamento. As leis decidem estrutura, quantidade, ordem e comportamento.

## As 18 leis

### A. Decisão e esforço mental

**1. Lei de Hick** — o tempo para decidir cresce com o número e a complexidade das opções.
- Fazer: uma ação primária por tela; opções demais viram etapas, categorias ou busca; destaque a opção recomendada; revelação progressiva para o avançado.
- Verificar: conte botões sólidos e itens de menu no primeiro nível. Mais de um CTA primário, navegação de primeiro nível sem agrupamento nem prioridade, ou select com dezenas de itens sem busca = problema. Não há número mágico: a partir de ~7 itens no topo, avalie se todos merecem o primeiro nível (isso é custo de decisão, não o limite de memória da lei de Miller).
- Cuidado: não vale para listas que a pessoa percorre sabendo o que procura (ordem alfabética, países). E esconder demais atrás de menus troca tempo de decisão por tempo de procura.

**2. Lei de Miller** — a memória de trabalho guarda poucos itens por vez (o artigo original fala em 7 ± 2; pesquisa posterior aponta mais para ~4 blocos).
- Fazer: quebre conteúdo em blocos (telefone, cartão, CNPJ com máscara; formulário em grupos de 3–5 campos); nunca exija lembrar algo de uma tela na outra — mostre de novo (resumo do pedido no checkout, filtro ativo visível).
- Verificar: código de verificação, IBAN, chave Pix exibidos em bloco único sem agrupamento; passo 3 que depende de valor visto no passo 1 e não o repete.
- Cuidado: **não** é "menu com no máximo 7 itens". Menu fica visível, não precisa ser memorizado. O limite é sobre o que a pessoa tem de reter.

**3. Lei de Tesler (conservação da complexidade)** — todo processo tem uma complexidade mínima que não some; ou o sistema absorve, ou o usuário paga.
- Fazer: o sistema absorve. Padrões inteligentes, preenchimento automático (CEP → endereço, bandeira do cartão pelo número), detecção de formato, lembrar a última escolha, aceitar colar.
- Verificar: campo pedindo algo que o sistema já sabe ou pode derivar; seletor de bandeira de cartão; pedir "confirme o e-mail"; máscara que rejeita colar.
- Cuidado: simplificar a tela removendo o que o usuário precisa não reduz complexidade, só a empurra para fora do produto.

**4. Navalha de Occam** — entre soluções que resolvem igual, fique com a de menos elementos e suposições.
- Fazer: para cada elemento da tela, pergunte "o que quebra se sair?". Nada? Sai. Menos campos, menos passos, menos estados.
- Verificar: campos opcionais que ninguém usa, etapas de confirmação sem risco, configurações sem caso de uso na Issue.
- Cuidado: a comparação é entre soluções **equivalentes**. Cortar o que resolve o problema não é simplicidade.

**5. Princípio de Pareto (80/20)** — a maior parte do uso vem de uma pequena parte das funções.
- Fazer: identifique as 1–3 ações que respondem pela maior parte do uso e dê a elas o melhor lugar, o menor número de toques e o maior cuidado de acabamento. O resto vai para segundo nível.
- Verificar: ação mais frequente escondida em menu "⋯"; todas as ações com o mesmo peso visual; atalho inexistente para a tarefa diária.
- Cuidado: os 20% vêm de dado (analytics, PRD, critérios de aceite), não de palpite. Sem dado, registre a hipótese no PR.

**6. Lei de Parkinson** — a tarefa se expande até ocupar o tempo disponível.
- Fazer: encurte o tempo que a tarefa parece e de fato leva: autofill, padrões, salvar automático, indicar duração real ("leva 2 minutos"), passos curtos com progresso.
- Verificar: formulário longo em página única sem progresso nem salvamento; fluxo sem estimativa; sessão que expira e apaga o que foi digitado.
- Cuidado: não é licença para cronômetro de urgência falsa. Isso é dark pattern e reprova em `site-compliance`.

### B. Movimento, tempo e convenção

**7. Lei de Fitts** — o tempo para atingir um alvo depende da distância até ele e do tamanho dele.
- Fazer: alvos de toque no tamanho **recomendado** — ≥ 44×44 pt (iOS), ≥ 48×48 dp (Android), ≥ 44×44 px CSS em web com toque — e nunca abaixo do **mínimo absoluto** de 24×24 px CSS (WCAG 2.2), com espaço entre vizinhos; a área clicável cobre o rótulo e o padding, não só o ícone; ação primária perto de onde a mão ou o cursor já está (zona do polegar no mobile, fim do formulário); ação destrutiva longe da primária.
- Verificar: ícone de 16px sem padding clicável; `<label>` não associado ao input; "Excluir" colado em "Salvar"; CTA no topo de tela longa no mobile.
- Cuidado: maior não é sempre melhor — depois de um tamanho confortável o ganho some e a hierarquia se perde.

**8. Limiar de Doherty** — a interação flui quando o sistema responde em menos de ~400 ms.
- Fazer: resposta visual imediata a todo clique (estado pressed, UI otimista); acima de ~400 ms mostre skeleton ou spinner; acima de alguns segundos mostre progresso e o que está acontecendo; nunca trave a tela inteira por uma parte dela.
- Verificar: botão sem estado de loading/disabled durante a requisição; lista que fica em branco carregando; duplo envio possível; ausência de `loading`/`Suspense`/skeleton nas rotas alteradas.
- Cuidado: é sobre **percepção**. Spinner piscando por 80 ms piora; dê um atraso mínimo antes de mostrá-lo. Animação que atrasa a resposta para "parecer rápido" viola a lei.

**9. Lei de Jakob** — as pessoas passam a maior parte do tempo em outros produtos e esperam que o seu funcione como eles.
- Fazer: use os padrões da plataforma e da categoria: logo leva à home, carrinho no canto superior direito, busca com lupa, puxar para atualizar, voltar no lugar do sistema, componentes nativos de data/select no mobile. Inove no que diferencia o produto, não na navegação.
- Verificar: gesto ou ícone inventado para função comum; link sem cara de link; scroll sequestrado; controle custom que perde teclado e leitor de tela.
- Cuidado: convenção de estrutura e comportamento não é desculpa para visual de template — a identidade é trabalho de `design-taste-frontend` e `unslop-design`. Em redesign de algo que já tem usuários, mude por partes.

### C. Percepção e agrupamento (Gestalt)

**10. Lei da proximidade** — o que está perto é percebido como grupo.
- Fazer: espaço dentro do grupo menor que o espaço entre grupos (ex.: 8 px label–campo, 24 px entre campos, 48 px entre seções); mensagem de erro colada ao campo dela; legenda perto da imagem.
- Verificar: `gap` uniforme em tudo; label equidistante de dois inputs; título mais perto do bloco de cima que do seu próprio conteúdo.

**11. Lei da similaridade** — elementos parecidos são lidos como tendo a mesma função.
- Fazer: uma aparência por função. Todo link igual, todo botão primário igual, todo item clicável com a mesma pista. O que não é clicável não usa a cor nem a forma do que é.
- Verificar: texto na cor de acento que não é link; dois estilos de botão primário; cards idênticos onde só alguns clicam; ícones de conjuntos misturados.

**12. Lei da região comum** — elementos dentro de um mesmo limite são percebidos como grupo.
- Fazer: use fundo ou borda para agrupar quando a proximidade sozinha não basta (card, seção de formulário, linha de tabela, item de lista com ações).
- Verificar: ação que pertence a um item fora do contêiner dele; card que mistura dois assuntos.
- Cuidado: caixa dentro de caixa é o sinal que `unslop-design` remove. Ordem de preferência: espaço → fundo → borda.

**13. Lei da conectividade uniforme** — elementos ligados visualmente (linha, cor, moldura contínua) parecem mais relacionados que os não ligados.
- Fazer: ligue o que é sequência ou relação: stepper com linha entre passos, timeline, aba conectada ao painel, linha entre nós, trilha de progresso.
- Verificar: passos soltos sem indicação de ordem; aba ativa visualmente desligada do conteúdo; dropdown longe do gatilho.

**14. Lei de Prägnanz (simplicidade)** — o olho resolve uma imagem ambígua na forma mais simples possível.
- Fazer: formas e layouts simples e regulares; grid consistente; alinhamentos em poucas linhas verticais; ícones reconhecíveis em 16–24 px.
- Verificar: ícone detalhado demais para o tamanho; layout com muitos eixos de alinhamento; ilustração ou gráfico que exige decifrar.

### D. Atenção, memória e impressão

**15. Efeito Von Restorff (isolamento)** — entre itens parecidos, o diferente é o lembrado.
- Fazer: **uma** coisa destacada por tela (CTA primário, plano recomendado, alerta crítico) por cor de acento, tamanho ou peso.
- Verificar: dois ou mais elementos disputando destaque; badge em tudo; destaque feito só por cor.
- Cuidado: destaque só por cor falha para daltônicos — some forma, texto ou ícone. Destaque que pisca ou se move respeita `prefers-reduced-motion`.

**16. Efeito de posição serial** — o primeiro e o último item de uma série são os mais lembrados.
- Fazer: itens mais importantes nas pontas da navegação (tab bar: principal à esquerda, perfil/ação à direita); menos importantes no meio; em listas de argumentos, o mais forte primeiro e o segundo mais forte por último.
- Verificar: ação-chave no meio de uma barra de 5 itens; informação decisiva enterrada no meio de um parágrafo ou de uma tabela de preços.

**17. Efeito Zeigarnik** — tarefa incompleta ou interrompida fica mais na memória que a concluída.
- Fazer: mostre o que falta (barra de progresso, "2 de 4", checklist de onboarding); salve rascunho e ofereça retomar; estado vazio que indica o próximo passo.
- Verificar: wizard sem indicador de etapa; formulário que perde tudo ao sair; perfil incompleto sem pista do que falta.
- Cuidado: progresso tem de ser verdadeiro. Barra inflada, pendência inventada e notificação de culpa são dark patterns (`site-compliance`).

**18. Efeito estética-usabilidade** — design agradável é percebido como mais fácil de usar, e as pessoas toleram mais os pequenos defeitos dele.
- Fazer: acabamento conta como usabilidade percebida — é o trabalho das skills visuais do protocolo. Capriche primeiro onde a confiança é decidida: primeira tela, login, pagamento, erro.
- Verificar: telas de erro, vazio e loading com o mesmo cuidado das telas felizes.
- Cuidado: a beleza **mascara** problema em teste e em revisão. Tela bonita não está aprovada: rode o checklist mesmo assim, e desconfie de elogio de usuário sem tarefa concluída.

## Por tipo de tela

| Tela | Leis que mandam | Decisão típica |
|---|---|---|
| Formulário / cadastro | Tesler, Miller, Proximidade, Fitts, Parkinson, Zeigarnik | Só o indispensável, grupos de 3–5 campos, máscara e autofill, erro junto do campo, progresso e rascunho se longo |
| Navegação / menu / tab bar | Jakob, Hick, Posição serial, Similaridade | Padrão da plataforma, poucos itens no primeiro nível, principais nas pontas |
| Landing / pricing | Von Restorff, Hick, Posição serial, Estética-usabilidade, Pareto | Um CTA, plano recomendado destacado, poucos planos, argumento forte primeiro |
| Checkout / pagamento | Tesler, Miller, Doherty, Zeigarnik, Fitts | Resumo sempre visível, etapas contadas, botão com loading e sem duplo envio |
| Dashboard / lista / tabela | Pareto, Proximidade, Região comum, Prägnanz, Doherty | Métrica principal maior, agrupamento por espaço, skeleton, ações frequentes à mão |
| Onboarding / wizard | Zeigarnik, Conectividade uniforme, Hick, Parkinson | Stepper ligado, uma decisão por passo, duração declarada, pular quando possível |
| Mobile (qualquer tela) | Fitts, Jakob, Doherty | Alvos ≥ 44 pt / 48 dp, primária na zona do polegar, gestos e componentes do sistema |
| Configurações | Hick, Região comum, Similaridade, Occam | Seções, padrões bons, avançado recolhido, nada sem caso de uso |
| Estados (loading, vazio, erro) | Doherty, Zeigarnik, Estética-usabilidade | Feedback em < 400 ms, próximo passo indicado, mesmo acabamento |

## Conflitos

- **Hick × Fitts / tempo de procura:** reduzir opções escondendo-as custa cliques e descoberta. Esconda só o que é raro (Pareto decide).
- **Jakob × identidade:** convenção manda em estrutura e comportamento; identidade manda em tipo, cor, composição e conteúdo.
- **Região comum × anti-slop:** agrupe por espaço antes de pôr caixa. Borda só quando o fundo não separa.
- **Von Restorff × Similaridade:** consistência é a regra, destaque é a exceção única da tela.
- **Occam × Tesler:** tire complexidade da tela absorvendo-a no sistema, não devolvendo-a ao usuário.
- **Estética-usabilidade × todas:** aparência nunca compensa lei violada na tarefa principal.
- **Qualquer lei × ética e acessibilidade:** `site-compliance` e `web-design-guidelines` vencem. Nenhuma lei justifica urgência falsa, culpa, opt-out escondido ou perda de teclado/contraste.

## Checklist de revisão

★ = bloqueante quando falha na tarefa principal da tela.

- [ ] ★ **Hick** — existe uma ação primária clara; nenhuma escolha com opções demais sem recomendação, agrupamento ou busca.
- [ ] ★ **Fitts** — alvos interativos no tamanho recomendado (44 pt iOS / 48 dp Android / 44 px web com toque), com área clicável cobrindo rótulo e padding; destrutiva separada da primária. Abaixo do mínimo absoluto (24×24 px CSS) é bloqueante em qualquer alvo; entre o mínimo e o recomendado é sugestão.
- [ ] ★ **Doherty** — toda ação tem resposta visual imediata; carregamentos têm skeleton/spinner/progresso; sem duplo envio.
- [ ] ★ **Jakob** — navegação, ícones, gestos e controles seguem a convenção da plataforma e da categoria.
- [ ] ★ **Tesler** — nenhum campo ou passo pede o que o sistema sabe ou pode derivar; colar e autofill funcionam.
- [ ] ★ **Miller** — nada precisa ser lembrado de outra tela; dados longos estão em blocos.
- [ ] ★ **Similaridade** — o que parece clicável clica; o que tem a mesma função tem a mesma aparência.
- [ ] ★ **Proximidade** — espaço interno do grupo menor que o espaço entre grupos; erro e ajuda junto do campo.
- [ ] **Região comum** — ações dentro do contêiner do item a que pertencem; sem caixa supérflua.
- [ ] **Conectividade uniforme** — sequências e relações visualmente ligadas.
- [ ] **Prägnanz** — formas, ícones e grid simples; poucos eixos de alinhamento.
- [ ] **Von Restorff** — um destaque por tela, não só por cor.
- [ ] **Posição serial** — itens mais importantes no início e no fim das séries.
- [ ] **Zeigarnik** — progresso visível e verdadeiro; trabalho incompleto é salvo e retomável.
- [ ] **Pareto** — ações mais frequentes no caminho mais curto.
- [ ] **Parkinson** — fluxo com duração declarada ou progresso; nada de espera ou passo desnecessário.
- [ ] **Occam** — nenhum elemento, campo ou etapa sem função para a tarefa.
- [ ] **Estética-usabilidade** — erro, vazio e loading com o mesmo acabamento; aparência não usada como argumento para aprovar.

## Referência

Seleção e nomes das leis: *Laws of UX*, de Jon Yablonski (lawsofux.com; livro pela O'Reilly). Texto, verificações e checklist desta skill são da casa.
