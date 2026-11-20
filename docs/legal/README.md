# Textos legais do Pocketoo

Rascunhos da Política de Privacidade e dos Termos de Uso, escritos a partir da seção LGPD do ADR-0001 (`docs/architecture/pocketoo/ADR-0001-stack.md`) e da seção 4 da proposta de arquitetura (`docs/architecture/pocketoo/proposta-arquitetura.md`). A revisão humana, de preferência jurídica, e a publicação no Hosting ficam na Issue #77.

| Arquivo                      | Conteúdo                                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `politica-de-privacidade.md` | Dados, finalidades, bases legais, compartilhamento, transferência internacional, retenção e direitos             |
| `termos-de-uso.md`           | Serviço, conta, uso permitido, aviso de que as sugestões não são consultoria financeira, responsabilidade e foro |

## Versão e consentimento

- Cada arquivo traz no topo a marca de rascunho e, em linha própria, o campo **Versão** no formato `MAJOR.MINOR.PATCH` (semver), escrito como `` - **Versão:** `0.1.0` ``, seguido da data da versão em ISO (`AAAA-MM-DD`). Hoje os dois estão em `0.1.0`.
- A versão é independente por documento: a política pode mudar sem mudar os termos.
- O consentimento do cadastro (Issue #14) grava a versão aceita de cada documento e a data. O app guarda a versão atual de cada documento numa constante, atualizada no mesmo PR que muda o texto, e compara por igualdade de texto: versão diferente da aceita pede novo aceite na próxima abertura.
- Rascunhos usam `0.x.y`. A primeira versão publicada, depois da Issue #77, é `1.0.0`.
- Toda mudança de conteúdo sobe a versão e, por isso, pede novo aceite (os dois textos dizem isso na última seção). Correção que não muda o sentido, como erro de digitação, mantém a versão.
- Ao publicar, retire o bloco de rascunho e preencha a vigência.

## Pendências para a revisão humana (Issue #77)

Campos entre colchetes no texto, que dependem de decisão ou dado real:

1. Identificação do controlador e do titular dos direitos do app (nome ou razão social, CPF ou CNPJ, endereço) e canal de privacidade. Se o controlador for agente de tratamento de pequeno porte, a indicação de encarregado pode ser dispensada, mas o canal de atendimento continua obrigatório (Resolução CD/ANPD nº 2/2022).
2. Prazo de retenção da API da Anthropic, ausência de uso para treino e assinatura do DPA (Issue #74), como exige o ADR antes de publicar.
3. Mecanismo de transferência internacional do art. 33 da LGPD para Google, Anthropic e Expo.
4. Prazo de aviso antes de encerrar o serviço (Termos, seção 12).

Pontos a conferir, já escritos no texto com a opção mais conservadora:

5. **Prazo de resposta.** O texto promete responder pedidos do titular em até 15 dias (art. 19, II, da LGPD). O controlador precisa confirmar que consegue cumprir.
6. **Registros de acesso.** O texto diz "até 30 dias", o padrão do Cloud Logging. Conferir a região do bucket de logs e se o art. 15 do Marco Civil da Internet (guarda de 6 meses) se aplica ao controlador.
7. **Relatórios de erro.** "Até 90 dias" é o prazo informado pelo Firebase Crashlytics; confirmar o vigente.
8. **Resumos e estratégias de IA (`insights`).** O texto limita o uso a "melhorar as próximas sugestões feitas a você" e diz que revogar a IA não apaga o que já foi gerado. Usar esses dados para treinar um motor com dados de várias pessoas (Fase 2) exige nova versão da política e novo consentimento. Apagar os `insights` ao revogar é decisão de produto em aberto.
9. **Bases legais.** Execução de contrato para os dados do serviço, consentimento para a IA, exercício regular de direitos para os registros de aceite e legítimo interesse para os dados técnicos. Confirmar, e avaliar se o legítimo interesse precisa de teste de balanceamento documentado.
10. **Incidentes.** O texto remete aos prazos da regulamentação da ANPD para comunicar incidentes, sem citar número de dias.
11. **Página publicada.** A página no Firebase Hosting registra o IP de quem a abre; avaliar se a política precisa citar isso ao publicar.
12. **Fase 2.** Antes da publicação pública: iOS, planos pagos (Termos precisam de seção de pagamento, renovação e reembolso), limite a mudanças unilaterais de funções, vários usuários no mesmo espaço (regra de exclusão de espaços compartilhados) e logos de terceiros na tela de assinaturas.

## Promessas do texto que dependem de outras Issues

Cada promessa abaixo vira critério de aceite da Issue que a implementa. Os itens marcados com "(da #4)" foram acrescentados ao corpo da Issue por este PR.

| Promessa                                                                                        | Issue                                                                |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Áudio transcrito no aparelho: reconhecimento local forçado; sem suporte, o microfone some       | #54 (da #4)                                                          |
| Exportação com todos os dados da conta, em bucket privado no Brasil, apagada em 24 h            | #65 (da #4 para a lista completa e a região)                         |
| Exclusão de tudo, com registro só de data e código anônimo                                      | #66                                                                  |
| Cópias de segurança até 30 dias, sem soft delete além disso; restauração reaplica exclusões     | #69 (da #4)                                                          |
| Relatórios de erro sem valores, descrições, nome ou e-mail; sem analytics nem ID de publicidade | #50 (da #4 para analytics e ID de publicidade)                       |
| Nenhum conteúdo do usuário em log das Functions                                                 | #25 (IA); demais Functions seguem a regra da proposta de arquitetura |
| IA opcional e desmarcada; só a versão e a data do aceite gravadas                               | #14                                                                  |
| O que vai à IA: texto e nomes de categorias; totais e metas; tipo de regra e números            | #26, #59, #62                                                        |
