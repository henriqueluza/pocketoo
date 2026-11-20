# Textos legais do Pocketoo

Rascunhos da Política de Privacidade e dos Termos de Uso, escritos a partir da seção LGPD do ADR-0001 (`docs/architecture/pocketoo/ADR-0001-stack.md`) e da seção 4 da proposta de arquitetura (`docs/architecture/pocketoo/proposta-arquitetura.md`). A revisão humana, de preferência jurídica, e a publicação no Hosting ficam na Issue #77.

| Arquivo                      | Conteúdo                                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `politica-de-privacidade.md` | Dados, finalidades, bases legais, compartilhamento, transferência internacional, retenção e direitos             |
| `termos-de-uso.md`           | Serviço, conta, uso permitido, aviso de que as sugestões não são consultoria financeira, responsabilidade e foro |

## Versão e consentimento

- Cada arquivo traz no topo a marca de rascunho e o campo **Versão** (`0.1.0` hoje), seguido da data da versão.
- O consentimento do cadastro (Issue #14) grava a versão aceita de cada documento e a data. Versão diferente da aceita pede novo aceite na próxima abertura do app.
- Rascunhos usam `0.x.y`. A primeira versão publicada, depois da Issue #77, é `1.0.0`.
- Mudança de conteúdo sobe a versão. Correção que não muda o sentido (erro de digitação) pode manter a versão.
- Ao publicar, retire o bloco de rascunho e preencha a data de vigência.

## Pendências para a revisão humana (Issue #77)

Campos entre colchetes no texto, que dependem de decisão ou dado real:

1. Identificação do controlador e do titular dos direitos do app (nome ou razão social, CPF ou CNPJ, endereço) e canal de privacidade. Se o controlador for agente de tratamento de pequeno porte, a indicação de encarregado pode ser dispensada, mas o canal de atendimento continua obrigatório (Resolução CD/ANPD nº 2/2022).
2. Prazo de retenção da API da Anthropic e assinatura do DPA, como exige o ADR antes de publicar.
3. Mecanismo de transferência internacional do art. 33 da LGPD para Google, Anthropic e Expo.
4. Prazo de aviso antes de encerrar o serviço (Termos, seção 12).

Pontos a conferir, já escritos no texto com a opção mais conservadora:

5. **Voz no aparelho.** A política diz que o áudio é transcrito no aparelho. A Issue #54 precisa forçar o reconhecimento local (sem envio de áudio ao serviço de fala do sistema). Se o aparelho não tiver reconhecimento local, o microfone deve sumir ou a política precisa mudar.
6. **Registros de acesso.** O texto diz "até 30 dias", o padrão do Cloud Logging. Conferir se o art. 15 do Marco Civil da Internet (guarda de 6 meses) se aplica ao controlador.
7. **Relatórios de erro.** "Até 90 dias" é o prazo informado pelo Firebase Crashlytics; confirmar o vigente.
8. **Resumos de IA (`insights`).** O texto limita o uso a "melhorar as próximas sugestões feitas a você". Usar esses dados para treinar um motor com dados de várias pessoas (Fase 2) exige nova versão da política e novo consentimento.
9. **Bases legais.** Execução de contrato para os dados do serviço, consentimento para a IA, obrigação legal para os registros de aceite e legítimo interesse para os dados técnicos. Confirmar, e avaliar se o legítimo interesse precisa de teste de balanceamento documentado.
10. **Fase 2.** Antes da publicação pública: iOS, planos pagos (Termos precisam de seção de pagamento, renovação e reembolso), vários usuários no mesmo espaço (regra de exclusão de espaços compartilhados) e logos de terceiros na tela de assinaturas.
