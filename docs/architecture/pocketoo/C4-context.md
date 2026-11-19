# Pocketoo — C4 nível 1 (contexto)

```mermaid
C4Context
  title Pocketoo — diagrama de contexto (Fase 1)

  Person(cliente, "Cliente", "Dona da microempresa de eventos; controla gastos pessoais (CPF) e da empresa (CNPJ)")
  Person(dev, "Responsável técnico", "Publica builds, define segredos e dispara produção")

  System(pocketoo, "Pocketoo", "App Android (Expo) offline-first + backend Firebase (Firestore, Auth, Cloud Functions) em southamerica-east1")

  System_Ext(google, "Google Sign-In", "Login com conta Google")
  System_Ext(anthropic, "API da Anthropic", "Claude Haiku 5.5: categorização, leitura de texto livre, resumos e estratégias")
  System_Ext(fcm, "Firebase Cloud Messaging", "Push de resumo semanal e mensal")
  System_Ext(play, "Google Play (teste interno)", "Distribuição do app para a cliente")
  System_Ext(eas, "Expo EAS", "Build, updates OTA e credenciais de assinatura")
  System_Ext(speech, "Reconhecimento de voz do aparelho", "Converte fala em texto no próprio celular")

  Rel(cliente, pocketoo, "Registra gastos e entradas, consulta limites e resumos")
  Rel(pocketoo, google, "Autentica", "OAuth")
  Rel(pocketoo, anthropic, "Envia só texto mínimo, sem identificadores", "HTTPS, a partir das Functions")
  Rel(pocketoo, fcm, "Envia notificações")
  Rel(pocketoo, speech, "Pede transcrição local")
  Rel(dev, eas, "Builds e updates via CI")
  Rel(eas, play, "Build de produção enviado por humano")
  Rel(play, cliente, "Instala e atualiza o app")
```

Fronteiras de confiança: o app no aparelho é não confiável (Rules e App Check protegem o backend); a API da Anthropic recebe só o necessário e sua saída é validada antes de qualquer uso.
