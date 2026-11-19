# Pocketoo — design system

> **Fonte oficial da interface: o arquivo do Figma** (https://www.figma.com/design/iUmLuJqnfOTH0iayKFTokk). Este documento registra os tokens lidos dele.
> **Vale a seção "Tokens lidos do Figma (v1)" no fim.** As seções anteriores a ela são o histórico da proposta v0 de 2026-10-30 e só valem onde a v1 não diz nada.
> Direção: estilo `pastel-consumer` (design-taste-frontend, seed 206829013), adaptado ao brief: fundo branco em vez de off-white, mascotes como a cor viva do app.

## Ideia

O dinheiro mora num porta-moedas que sorri. Os números ficam sérios e legíveis; a leveza vem do mascote e das cores das categorias, nunca da tipografia dos valores.

**Pergunta da tela inicial:** "quanto ainda posso gastar este mês, e em que pé está cada limite?" O maior número da tela responde a ela.

## Modos

| | Pessoal (CPF) | Empresa (CNPJ) |
|---|---|---|
| Acento (ações, foco, seleção) | framboesa `#B83A63` (5,5:1 no branco) | petróleo `#1F6F68` (6,0:1) |
| Corpo do Tuu | coral `#F26B5B` | petróleo `#1F6F68` |
| Títulos | Fredoka 600 | Manrope 600 |
| Mascote na home | grande, com balão de fala | pequeno, ao lado do título |
| Raio dos cards | 20 | 16 |

O mesmo personagem, a mesma estrutura e as mesmas categorias: muda a roupa, não a pessoa.

## Cores

```css
:root {
  --ground: #ffffff;      /* brief: fundo branco */
  --raised: #f5f6f8;      /* superfícies e campos: um degrau de tom, sem sombra */
  --border: #e8e8ea;
  --rule: #f1f1f3;
  --text: #1b1d1f;        /* 16,9:1 */
  --muted: #5c6064;       /* 6,3:1 */
  --accent: #b83a63;      /* CPF; CNPJ troca por #1f6f68 */
  --accent-soft: #fce4ec; /* CNPJ: #ddf1ee */
  --accent-ink: #7a1f3f;  /* CNPJ: #0e3f3a */
  --coin: #f5c842;        /* só ilustração e marcas; nunca texto */
  --positive: #2f7a45;    /* entradas, com "+" */
  --negative: #c41c29;    /* só limite estourado e erro */
  --warning-bg: #fff4cc; --warning-ink: #6b4e00;  /* limite perto (80%) */
}
```

Gastos comuns em tinta, sem vermelho. Cor de alerta só na categoria em risco.

### Categorias (tile pálido + tinta do mesmo tom)

| Categoria | Tile | Tinta |
|---|---|---|
| Mercado | `#e3f4e6` | `#1f5a2c` |
| Restaurantes e delivery | `#fdeadf` | `#7a3410` |
| Transporte | `#e1eefc` | `#0a3a80` |
| Casa e contas | `#efe7fb` | `#4a2a7a` |
| Saúde | `#dff3f3` | `#0e4f4f` |
| Lazer | `#fff1cc` | `#6b4e00` |
| Compras | `#fce4ec` | `#7a1f3f` |
| Assinaturas | `#e9ecf1` | `#2f3640` |

## Tipografia

- **Fredoka** (títulos no modo pessoal, nome do app, balões do mascote).
- **Manrope** (todo o resto, e todo número). Números com `tnum`, alinhados à direita em listas.
- Escala: 12 / 14 / 16 / 20 / 28 / 34. O saldo disponível é o único número a 34.
- Centavos em tamanho menor e cinza: R$ 1.248**,30**.

## Forma e espaço

- Grade de 4 px; margem lateral 20; espaço entre blocos 24.
- Raios: 20 (cards CPF) / 16 (cards CNPJ) / 12 (campos, chips) / 999 (botões e toggle CPF/CNPJ).
- Sem sombra em nada em repouso; sombra só em bottom sheet e diálogos.
- Alvos de toque ≥ 48 px; barra inferior com 4 destinos + botão central de registrar.

## Mascotes (placeholders)

Imagens de `~/Trabalho/pocketoo/pocketoo-design/design/mascots/raw/` até a definição final:
- Tuu (marca): `brand-r2/G3.png` (CPF) e `brand-r2/G1.png` (CNPJ).
- Cartões e faturas: `brand-r2/W1.png`.
- Demais categorias: o tile de cor da categoria com a inicial, até os mascotes existirem.

## Motion (para a implementação)

Só com propósito: o Tuu pisca e respira em repouso; a moeda pula ao registrar um gasto; balão de alerta entra com mola curta (220 ms). Tudo respeita "reduzir movimento".

## Proposta v0 no Figma (2026-10-30)

Arquivo: https://www.figma.com/design/iUmLuJqnfOTH0iayKFTokk — página "Proposta v0", 6 telas de 412×915: início pessoal, início empresa, registrar gasto, cartão e fatura, resumo da semana e quiz do primeiro uso.
Camadas editáveis (convertidas de HTML), ainda sem componentes nem variáveis; isso vem depois da aprovação.
Dados de exemplo inventados, a trocar pelos da cliente: nome da empresa ("Ateliê de Eventos"), eventos, valores, cartão final 4821.

## Revisão v1 (2026-10-30, pedido do usuário com capturas de referência)

- **Categorias em cores vivas e saturadas** (fill cheio, glifo em tinta escura): casa `#FF8A3D`, mercado `#1FB57F`, restaurantes `#EC4C8C`, transporte `#5C95F5`, assinaturas `#A97CF5`, lazer `#FFC233`, saúde `#F25555`, eventos `#2BB5A8`. Substitui os tiles pálidos da v0; barras de limite usam a cor da categoria, e o estado (passou, perto) fica na pílula.
- **Tipografia: SF Pro** (UI e números) e **SF Pro Rounded** (títulos no modo pessoal). Substitui Manrope e Fredoka.
  - Licença: a Apple só permite SF em software para plataformas Apple. No Android, o app usa **Inter** (OFL, desenho quase igual ao SF); no iOS, a fonte do sistema. Decidir no ADR.
- Gráfico de rosca com várias cores por pedido do usuário; o valor e o percentual de cada fatia estão sempre na legenda, para não depender só da cor.
- Nova tela "07 Gastos do mês" (rosca + lista por categoria). As telas v0 ficaram abaixo, no mesmo canvas, como histórico.
- Nova tela "08 Assinaturas" (total mensal e anual, aviso do Tuu sobre os serviços de vídeo, próximas cobranças com logo de cada serviço). Logos do Simple Icons 16.35.0 (CC0), na cor de cada marca. A Disney+ não está no Simple Icons (retirada a pedido da Disney) e aparece com o nome num quadradinho cinza. Preços ilustrativos; o total bate com a categoria Assinaturas (R$ 260,00).
- **Para produção:** antes de exibir logos de terceiros no app, decidir a fonte (provedor licenciado de logos ou logo genérico por categoria) e checar as regras de marca de cada serviço.

## Revisão de 2026-11-18

- O Figma passou a ser a fonte oficial da interface. A comparação com o escopo do MVP, as 45 telas complementares e os 9 mascotes de categoria estão em `docs/design/pocketoo-revisao.md` (aguardando aprovação).
- Cor nova proposta: Compras `#9CCB3B`.
- Mascotes de categoria: nas listas e gráficos fica o quadrado colorido com a inicial; o mascote aparece em alertas, resumos, estratégias, avisos e tutorial.

## Tokens lidos do Figma (v1, 2026-11-18)

Valores lidos nó a nó das telas 01 a 08. O arquivo ainda não tem variáveis nem estilos; quando forem criados, usam estes nomes. Capturas em `telas/`, medidas completas dos componentes em `kit.css`.

### Cor

| Token | Pessoal | Empresa | Uso |
|---|---|---|---|
| `accent` | `#B83A63` | `#1F6F68` | botão principal, toggle ativo, links, barra de progresso geral, foco |
| `accentSoft` | `#FCE4EC` | `#DDF1EE` | balão do mascote, opção marcada, cartão "a empresa te deve" |
| `accentInk` | `#7A1F3F` | `#0E3F3A` | texto sobre `accentSoft` |
| `onAccentMuted` | `#FDE7EF` | `#DDF1EE` | texto secundário sobre `accent` |

| Token | Valor | Uso |
|---|---|---|
| `bg` | `#FFFFFF` | fundo de toda tela |
| `surface` | `#F1F2F4` | trilho do toggle, trilho das barras, campos, chips inativos |
| `border` | `#E8E8EA` | contorno de cartão |
| `rule` | `#F1F1F3` | linha entre campos |
| `navBorder` | `#EEEFF1` | borda da barra inferior e divisores de colunas |
| `optionBorder` | `#E1E3E6` | contorno de opção não marcada |
| `control` | `#C9CCD1` | contorno de checkbox vazio, switch desligado |
| `text` | `#1B1D1F` | texto e valores |
| `muted` | `#5C6064` | rótulos, centavos, texto de apoio |
| `placeholder` | `#8A8E93` | placeholder e setas |
| `positive` | `#2F7A45` | entradas e variação a favor, sempre com sinal ou texto |
| `danger` | `#C41C29` | só ação destrutiva e erro |
| `warnBg` / `warnInk` | `#FFF4CC` / `#6B4E00` | pílula e balão de "perto do limite" |
| `overBg` / `overInk` | `#FFEDEA` / `#831C1E` | pílula e aviso de "passou" |
| `barNeutral` | `#E4E6EA` | barras do gráfico semanal sem destaque |

Categorias (quadrado cheio, inicial em `text`): Casa e contas `#FF8A3D`, Mercado `#1FB57F`, Restaurantes `#EC4C8C`, Transporte `#5C95F5`, Assinaturas `#A97CF5`, Lazer `#FFC233`, Saúde `#F25555`, Eventos `#2BB5A8`, Compras `#9CCB3B`, Outros `#E9ECF1`. As categorias da empresa reaproveitam essa paleta (ver tela 39).

Gasto comum é escrito em `text`, nunca em vermelho. Estado nunca depende só da cor: a pílula traz o texto ("82%", "Passou").

### Tipografia

Figma: SF Pro (texto e números) e SF Pro Rounded (títulos do modo Pessoal). **No Android o app usa Inter**; a família arredondada dos títulos do modo Pessoal é decidida na Issue do tema (candidata: Nunito 700) e registrada aqui. No modo Empresa os títulos usam a família de texto em 600.

| Estilo | Tamanho / altura | Peso | Uso |
|---|---|---|---|
| `amountXL` | 34 / 38, espaçamento −0,7 | 600 | valor principal da tela; centavos em 20,4 / 500 `muted` |
| `amountL` | 22 / 27 | 600 | valores secundários; centavos em 13,2 / 500 `muted` |
| `question` | 26 / 31,2 | 700 arredondada | pergunta do quiz, títulos de tela cheia |
| `wordmark` | 24 / 29 | 700 arredondada | "Pocketoo" no início |
| `titleCompany` | 20 / 27 | 700 | nome da empresa no início do modo Empresa |
| `entry` | 20 / 27 | 600 | texto digitado no registro, valor confirmado |
| `section` | 18 / 22 | 700 arredondada (600 texto na Empresa) | títulos de seção e de cabeçalho |
| `button` | 16 / 22 | 700 | botão principal |
| `option` | 16 / 22 | 600 | opção do quiz |
| `body` | 15 / 20 | 600 nomes e valores, 400 rótulos | linhas e campos |
| `bubble` | 15 / 21,8 | 400, destaque em 700 | balão do mascote |
| `label` | 14 / 19 | 400 `muted` | rótulos de cartão; links em 600 `accent` |
| `support` | 14 / 20,3 | 400 `muted` | texto de apoio |
| `caption` | 13 / 18 | 400 `muted` | segunda linha das linhas |
| `pill`, `tab` | 12 / 16 | 600 (aba ativa 700) | pílulas e barra inferior |

Todo número usa algarismos tabulares; valores em listas alinham à direita. Dinheiro sempre com `Intl.NumberFormat("pt-BR", {style:"currency", currency})`.

### Forma e espaço

- Tela de referência 412 × 915; margem lateral 20; 20 entre blocos (24 antes de seção em telas de formulário).
- Raios: cartão 20 (Pessoal) e 16 (Empresa); campo de registro e opção 18; aviso 16; quadrado de categoria 12 (8 no tamanho 28); campo de formulário 12; checkbox 8; botões, toggle, chips, pílulas e barras 999; balão 20 com o canto inferior esquerdo em 6.
- Alturas: cabeçalho 44; toggle 48 (segmento 40); botão principal 56; botão pequeno 44; campo de formulário 52; linha de campo 52; linha de lançamento 56 (50 compacta); linha de limite 78; barra de progresso 10; passos do quiz 6; barra inferior 84 com botão central de 60 elevado 18.
- Cartão: contorno de 1 px `border`, sem sombra, preenchimento interno 20. Nada tem sombra em repouso.
- Ícones: traço de 2 px com pontas redondas, 24 (18 nas setas de campo).
- Alvo de toque mínimo de 48.

### Mascotes

| Arquivo (`mascotes/`) | Personagem | Onde aparece |
|---|---|---|
| `tuu-pessoal.png` | Tuu, porta-moedas coral | marca, balões e alertas gerais no modo Pessoal |
| `tuu-empresa.png` | Tuu em petróleo | cabeçalho do modo Empresa (44 px) |
| `carteira.png` | Carteira azul | cartões e faturas |
| `mercado.png`, `restaurantes.png`, `transporte.png`, `casa.png`, `saude.png`, `lazer-sorvete.png`, `compras.png`, `assinaturas.png`, `eventos.png` | um por categoria | alertas de limite, resumos, estratégias, avisos e tutorial |

Tamanhos: 56 com raio 16 nos balões, 96 com raio 24 no quiz e em telas vazias, 44 com raio 14 em avisos, 40 com raio 12 em listas de avisos. Nas listas e nos gráficos a categoria aparece como quadrado colorido com a inicial, não como mascote. Categoria criada pela usuária usa só a inicial. No MVP os mascotes são imagens estáticas.
