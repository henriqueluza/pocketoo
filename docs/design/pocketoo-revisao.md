# Pocketoo — revisão do design existente (2026-11-18)

> Compara as 8 telas do Figma (página "Proposta v0", telas 01 a 08) com o escopo do MVP do PRD.
> Arquivo: https://www.figma.com/design/iUmLuJqnfOTH0iayKFTokk
> Capturas das 53 telas: `docs/design/telas/`. Página de revisão usada na aprovação: https://claude.ai/artifact/MKRyqSvXjySNPiVQFdCV77 (privada do usuário).
> Status: **aprovado pelo usuário em 2026-11-18** (as 45 telas e os 9 mascotes). Nenhuma tela existente foi alterada; as mudanças nas telas 01 a 08 continuam sem autorização.

## Como o arquivo está

- Uma página, 8 telas v1 de 412×915 (01 a 08) e 6 telas v0 guardadas abaixo como histórico.
- Camadas editáveis convertidas de HTML. **Não há variáveis, estilos de texto, estilos de cor nem componentes.** O bootstrap precisa criá-los antes de "extrair" o tema.
- Fontes: SF Pro (texto e números) e SF Pro Rounded (títulos do modo pessoal).
- Mascotes: Tuu em duas cores (pessoal e empresa) e a carteira dos cartões. As categorias usam um quadrado colorido com a inicial.

## Cobertura por item do PRD

| # | Item do MVP | Situação no Figma | Complemento proposto |
|---|---|---|---|
| 1 | Cadastro e login | Falta | 09 Boas-vindas e entrar, 10 Criar conta |
| 2 | Bloqueio por biometria ou PIN | Falta | 11 Desbloqueio |
| 3 | Consentimento LGPD, política e termos | Falta | 10 (aceite e consentimento de IA separado), 47 Seus dados |
| 4 | Exportar dados e excluir conta | Falta | 47 Seus dados, 48 Excluir conta |
| 5 | Alternância Pessoal/Empresa com visual diferente | **Coberto** (01, 02, 03, 07) | — |
| 6 | Contas e meios de pagamento | Parcial (só um cartão, tela 04) | 24 Cartões e contas, 25 Novo cartão |
| 7 | Gasto de um espaço pago com conta do outro | Parcial (cartão "A empresa te deve" na 02) | 19 Registrar, empresa paga com dinheiro pessoal |
| 8 | Acerto: reembolso, aporte, retirada | Falta (só o botão "Acertar") | 36 Acerto com a empresa; retirada aparece em 23 |
| 9 | Categorias padrão e personalizadas | Falta | 39 Categorias da empresa, 40 Nova categoria |
| 10 | Eventos com orçamento e custo | Parcial (lista na 02) | 37 Eventos, 38 Evento, detalhe |
| 11 | Registrar gasto e entrada em poucos toques | Parcial (só gasto, tela 03) | 22 Registrar entrada, 23 Lançamentos do mês |
| 12 | Texto livre com confirmação | **Coberto** (03) | 21 Faltou o valor (baixa confiança) |
| 13 | Registro por voz | Parcial (botão de microfone na 03) | 20 Ouvindo |
| 14 | Cartão: fatura certa, parcelas futuras | **Coberto** (04) | 18 Crédito parcelado, 24, 25 |
| 15 | Empréstimos e dívidas | Falta | 26 Empréstimos e dívidas, 27 Dívida, detalhe |
| 16 | Assinaturas e fixos, total comprometido | Parcial (só assinaturas, tela 08) | 28 Fixos do mês, 29 Nova conta fixa |
| 17 | Limites por categoria e total, alerta a 80% e ao passar | Parcial (alerta de "passou" na 01) | 30 Limites do mês, 31 Definir limite, 32 Alerta perto do limite, 33 Alerta no modo Empresa |
| 18 | Gastos do mês em rosca | **Coberto** (07) | — |
| 19 | Resumo semanal e mensal | Parcial (semanal, tela 05) | 34 Resumo do mês |
| 20 | Estratégias personalizadas | Falta | 35 Estratégias (com resposta "vou tentar" e "não serve") |
| 21 | Quiz inicial | Parcial (1 de 6 perguntas, tela 06) | 12 Hábitos, 13 Metas, 14 Sua empresa, 15 Plano pronto |
| 22 | Tutorial sempre disponível | Falta | 16 Tutorial, 17 Ajuda |
| 23 | Importar .xlsx | Falta | 41 Escolher planilha, 42 Conferir colunas, 43 Revisar lançamentos |
| 24–25 | Notificações | Falta | 44 Avisos, 45 Lembretes e avisos |
| 26 | Estados vazio, carregando, erro, sem internet | Falta | 49 Primeiro dia, 50 Carregando, 51 Sem internet, 52 Erro |
| 27 | Um mascote por categoria | Falta (só Tuu e carteira) | 53 Mascotes das categorias (9 novos) |
| — | Menu "Mais" | Falta (a aba existe, a tela não) | 46 Mais |

Resumo: 4 itens cobertos, 9 parciais, 14 ausentes. Os 45 complementos cobrem todos.

## Onde o Figma diverge do brief

| # | Divergência | O que proponho |
|---|---|---|
| 1 | **Fonte.** SF Pro e SF Pro Rounded só podem ser usadas em software para aparelhos Apple. | Android usa Inter (decisão do ADR). Falta escolher a substituta arredondada dos títulos do modo pessoal; sugiro Nunito ou manter Inter 700. |
| 2 | **Mascotes.** O brief pede um por categoria; o arquivo tem dois. | 9 mascotes novos no estilo do Tuu (seção abaixo). |
| 3 | **Tela 03.** O campo "Evento" aparece no modo Pessoal e não há como registrar entrada. | Esconder "Evento" no modo Pessoal; seletor "Gasto / Entrada" abaixo do toggle (ver tela 22). **Altera tela existente: precisa de aprovação.** |
| 4 | **Tela 08.** Usa logos de marcas de terceiros e não mostra contas fixas (aluguel, internet). | Tela 28 reúne fixos e assinaturas com o total comprometido. Logos: manter na Fase 1 (uma usuária, teste interno); trocar por fonte licenciada antes da Fase 2. |
| 5 | **Navegação.** A tela Assinaturas marca a aba "Mais"; dívidas e fixos não tinham lugar. | A aba Cartões vira "Cartões e contas" e leva a fixos e dívidas (tela 24). |
| 6 | **Barra de status** no padrão do iPhone; a Fase 1 é Android. | Trocar para o padrão Android nas 8 telas. **Altera telas existentes: precisa de aprovação.** |
| 7 | **Início Pessoal** não mostra entradas, que entraram no MVP em 04/11. | Sem mudança na 01: entradas aparecem em Lançamentos (23) e no resumo do mês (34). |
| 8 | **Toggle** diz "Pessoal / Empresa"; o brief diz "CPF / CNPJ". | Manter "Pessoal / Empresa": é mais claro para quem achou planilha difícil. |

## Mascotes de categoria (propostos)

Gerados com a geração de imagem do Figma, usando o mesmo molde de prompt do Tuu (personagem em 2 cores, 3D macio, saindo do canto inferior esquerdo, fundo pastel). Cópias de 512 px em `docs/design/mascotes/` (originais de 1024 px no workspace de design do usuário, `design/mascots/raw/categorias-v1/`). Já criados no arquivo do Figma (nós 39:2 a 39:10, ainda soltos na página).

| Categoria | Mascote | Cor da categoria | Arquivo |
|---|---|---|---|
| Mercado | Cesta com duas frutas | `#1FB57F` | `mercado.png` |
| Restaurantes | Cloche (tampa de prato) | `#EC4C8C` | `restaurantes.png` |
| Transporte | Ônibus | `#5C95F5` | `transporte.png` |
| Casa e contas | Casinha com chaminé | `#FF8A3D` | `casa.png` |
| Saúde | Cápsula | `#F25555` | `saude.png` |
| Lazer | Pote de sorvete | `#FFC233` | `lazer-sorvete.png` |
| Compras | Sacola | `#9CCB3B` (cor nova) | `compras.png` |
| Assinaturas | Calendário de argolas | `#A97CF5` | `assinaturas.png` |
| Eventos | Crachá | `#2BB5A8` | `eventos.png` |

Regra de uso proposta: nas listas e gráficos a categoria continua com o quadrado colorido e a inicial (legível a 40 px e igual à cor da rosca); o mascote aparece nos alertas, resumos, estratégias, avisos e tutorial. Categoria criada pela usuária usa só a inicial.

O mascote de Lazer nasceu como balde de pipoca e foi aprovado pelo usuário como sorvete, sem refazer a imagem. Ponto fraco conhecido: as 6 categorias próprias da empresa (Local e estrutura, Decoração, Equipe, Divulgação, Impostos e taxas, Escritório) ainda não têm mascote.

## Como os complementos foram feitos

- Fonte: `~/Trabalho/pocketoo/pocketoo-design/design/complementos/` (`kit.py` com os componentes medidos no Figma, `screens_a.py`, `screens_b.py`, `build.py`). `python3 build.py` gera `out/`.
- Medidas, cores, raios e tipografia foram lidos nó a nó das telas 01 a 08; os ícones foram redesenhados no mesmo traço (2 px, pontas redondas) porque a exportação dos originais ficou bloqueada.
- Dados de exemplo coerentes com as telas existentes (outubro, R$ 4.500,00 de limite, cartão final 4821, Ateliê de Eventos). O nome de exemplo é Fabiana, o nome da cliente.

## Pendência: importar no Figma

O plano Starter do Figma permite cerca de 20 chamadas de leitura por mês pela integração e o limite foi atingido nesta sessão, depois da leitura das telas. A geração de imagem não conta nesse limite, por isso os mascotes entraram. A importação das telas ficou bloqueada.

Quando o limite renovar, ou com um mês de plano pago (Professional: 200 chamadas por dia):

1. Importar `out/figma-lote-1.html`, `-2` e `-3` com o seletor `.screen` (cada tela vira um quadro).
2. Nomear os quadros de 09 a 53 e organizá-los em linhas por grupo, abaixo das telas v1.
3. Trocar os ícones redesenhados pelos originais do arquivo.
4. Arrumar os 9 quadros de mascote (39:2 a 39:10) numa linha "Mascotes" e conferir se nenhum ficou sobre as telas existentes.

## Decisões do usuário (2026-11-18)

| Tema | Decisão |
|---|---|
| 45 telas complementares | Aprovadas. |
| 9 mascotes de categoria | Aprovados; o de Lazer passa a ser o Sorvete. |
| Cor de Compras (`#9CCB3B`) | Aprovada junto com as telas que a usam. |
| Nome de exemplo | Fabiana (nome da cliente). |
| Figma | Usuário assina o plano pago por volta de 20/11 e avisa; a importação espera isso. |

Ainda sem resposta:

1. Autorizar as duas mudanças em telas existentes (tela 03: esconder "Evento" no modo Pessoal e seletor Gasto/Entrada; barra de status no padrão Android). Sem autorização, as telas 01 a 08 ficam como estão e o código segue os complementos (22 para entrada).
2. Mascotes das 6 categorias da empresa. Padrão adotado: inicial na Fase 1.
