---
name: mobile-bottom-nav
description: Navbar inferior (bottom nav / tab bar) de apps mobile — catálogo de 8 estilos (minimal clean, floating pill, pill highlight, botão central de ação, glassmorphism, tab indicator, iOS dock, dark com label expansível), quando usar cada um, regras base e checklist de 5 verificações (3–5 abas, estado ativo, labels, área de toque de 48px, safe area). Use ao criar ou alterar a navegação principal de um app em React Native/Expo, Flutter, SwiftUI, Compose ou web mobile/PWA, e ao revisar uma tab bar existente. Não use para navbar/header de site (design-references → navbar.gallery) nem para navegação lateral de dashboard.
---

# Bottom nav para apps mobile

Skill da casa. Guia para escolher, desenhar e validar a barra de navegação inferior de um app mobile.

## Lugar no protocolo de design

Passo 4a de `.claude/rules/10-ui-design.md`: entra depois que a direção já foi definida (`ui-ux-pro-max` → `design-taste-frontend --app` → `impeccable`) e antes do `unslop-design`.

- `DESIGN.md`/tokens do projeto mandam em cor, raio, sombra e tipografia. Esta skill decide **estrutura e comportamento** da barra, não a paleta.
- O estilo escolhido tem de caber na direção sorteada. Glassmorphism (estilo 5) só entra se a direção já usa fundo colorido ou imagem; não crie gradiente só para justificar o blur. O mesmo vale para a translucidez do iOS dock (estilo 7).
- **Pílula, blur e sombra aqui são funcionais**: a cápsula delimita a barra, o tint ou a pílula marca a aba ativa, a sombra separa a barra do conteúdo que rola por baixo. Não são os pills/tags decorativos nem os gradientes de fundo que o `unslop-design` remove. Continua valendo o resto dele: uma cor de acento, raio interno = externo − padding, sem borda e sombra ao mesmo tempo.
- API de navegação (React Navigation, Expo Router, `NavigationBar` do Flutter, `TabView`, `NavigationBar` do Compose): confirme no Context7 para a versão instalada.

## Como usar

1. Entenda o app: quantos destinos principais existem, qual é a ação mais importante, e se o conteúdo atrás da barra é neutro ou colorido/com imagens.
2. Escolha **um** estilo do catálogo pela tabela de decisão. Não misture dois estilos na mesma barra.
3. Implemente seguindo as regras base.
4. Rode o checklist final. Item que falha é corrigido antes do PR.
5. Registre na seção Design do PR: estilo escolhido, motivo e resultado das 5 verificações.

## Catálogo de estilos

| # | Estilo | Como é | Quando usar | Cuidado |
|---|--------|--------|-------------|---------|
| 1 | Minimal clean | Barra colada na borda, fundo sólido, linha fina no topo, ícone + label; o ativo só muda de cor | Padrão seguro; apps em que o conteúdo é o protagonista | Pode ficar genérico; capriche em ícones e espaçamento |
| 2 | Floating pill | Barra em cápsula, afastada das bordas, com sombra suave | Sensação de produto premium; telas de fundo claro e limpo | Precisa de margem lateral e inferior; o conteúdo rola por baixo, então some padding no fim da lista |
| 3 | Pill highlight | Barra padrão; a aba ativa ganha um fundo arredondado em tom suave da cor de acento | Quando o estado ativo precisa ser impossível de errar | O tint precisa de contraste com o fundo da barra |
| 4 | Botão central de ação | Botão circular elevado no centro (ex.: +), com abas dos dois lados | Só quando criar algo é a função principal do app (postar, registrar, adicionar) | Número par de abas ao redor (2 ou 4); o botão é ação, não destino, mas ocupa uma posição: 2 + botão ou 4 + botão |
| 5 | Glassmorphism | Barra translúcida com blur sobre fundo colorido ou imagens | Apps visuais, com fotos ou cor atrás da barra | Teste contraste de ícones e labels em **todas** as telas, não só na home |
| 6 | Tab indicator | Barra padrão com uma barrinha fina acima (ou abaixo) da aba ativa | Indicar posição com precisão sem pesar o visual | Anime o deslize do indicador entre abas |
| 7 | iOS dock | Contêiner arredondado e translúcido, encaixado perto da borda, ícone + label | Apps iOS que querem parecer nativos | Em Android pode destoar; prefira o padrão da plataforma. A translucidez só se justifica com cor ou imagem atrás, como no estilo 5; sobre fundo neutro use fundo sólido |
| 8 | Dark + label expansível | Cápsula escura só com ícones; a aba ativa vira uma pílula clara com ícone + label | Visual marcante com 4–5 abas e ícones muito reconhecíveis | Abas inativas ficam sem label: só ícones universais, sempre com label de acessibilidade |

### Decisão rápida

- Não sabe qual escolher → 1 (Minimal clean).
- Mais personalidade sem risco → 3 (Pill highlight) ou 6 (Tab indicator).
- App focado em criar conteúdo → 4 (Botão central).
- Fundo colorido ou fotos → 5 (Glassmorphism), com teste de contraste.
- Aparência premium → 2 (Floating pill) ou 8 (Dark + label expansível).
- iOS nativo → 7 (iOS dock).

## Regras base (valem para todos os estilos)

- **Quantidade:** de 3 a 5 posições na barra, contando o botão central do estilo 4. Mais que isso vai para um destino "Mais" ou para outra estrutura de navegação.
- **Estado ativo:** percebido de relance. Combine pelo menos dois sinais (cor + peso, cor + fundo, cor + indicador). Nunca dependa só de uma diferença sutil de cor.
- **Labels:** curtos, de uma palavra, visíveis em todas as abas. Ícone sozinho obriga o usuário a adivinhar. Única exceção: o estilo 8, em que só a aba ativa mostra o label — por isso ele exige ícones universais (casa, lupa, sino, pessoa) e label de acessibilidade em todas as abas; se algum ícone precisa de explicação, troque de estilo.
- **Área de toque:** mínimo de 48×48 por aba, mesmo que o ícone seja menor. A casa adota 48 em todas as plataformas por ser o valor mais conservador: 48dp no Android (Material), 48pt no iOS (acima dos 44pt da HIG) e 48px CSS na web.
- **Safe area:** respeite a área segura inferior para não colidir com a home bar e os gestos do sistema — `useSafeAreaInsets`/`SafeAreaView` (React Native), `SafeArea` (Flutter), `safeAreaInset` (SwiftUI), `WindowInsets` (Compose), `env(safe-area-inset-bottom)` (web).
- **Ícones:** uma única família, mesmo peso de traço; versão preenchida ou colorida para o ativo é bem-vinda.
- **Conteúdo:** a última linha da tela nunca fica escondida atrás da barra; some padding inferior igual à altura da barra + margem.
- **Acessibilidade:** cada aba com role de tab/botão, label acessível e estado selecionado exposto; contraste mínimo 4.5:1 para labels e 3:1 para ícones.
- **Movimento:** transições de 150–250 ms; respeite a preferência de movimento reduzido.
- **Teclado:** a barra some ou fica atrás do teclado virtual; nunca sobe junto com ele.

## Checklist antes do PR

As 5 verificações abaixo são o mínimo que vai registrado no PR; as regras base acima continuam valendo por inteiro.

1. **3–5 posições** — nunca mais que isso; o botão central conta.
2. **Estado ativo** — óbvio em um relance.
3. **Labels** — ninguém precisa adivinhar o que cada aba faz (no estilo 8: ícones universais + label de acessibilidade).
4. **Área de toque** — 48×48 no mínimo.
5. **Safe area** — a barra não invade a home bar.

Falha em qualquer item é achado bloqueante: o `ui-reviewer` cobra o registro do passo 4a (`.claude/agents/ui-reviewer.md`, item 2).
