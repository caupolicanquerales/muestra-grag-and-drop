# System Architecture

This document provides a high-level overview of the main frontend modules and services and how they interact. The diagram below is a Mermaid class diagram illustrating component ↔ service relationships and primary flows.

```mermaid
classDiagram
  %% Components
  class AppRoot{
    +loadComponent(name)
  }
  class BillMenu
  class BillConstructor
  class BillEditor
  class BillData
  class BillDeletePrompt
  class ProcessTemplateBill
  class BillVisualizer

  %% Services
  class ServiceGeneral
  class ExecutingRestFulService
  class HttpClientService
  class ReceiveDataService
  class ConvertBase64ByteService
  class MessageService

  %% Relationships (uses)
  AppRoot --> ServiceGeneral : subscribes
  AppRoot --> ReceiveDataService : uses (SSE)
  AppRoot --> HttpClientService : uses

  BillMenu --> ServiceGeneral : subscribes/publishes
  BillMenu --> ExecutingRestFulService : fetch prompts
  BillMenu --> HttpClientService : load templates

  BillConstructor --> ServiceGeneral : subscribes/publishes
  BillConstructor --> ExecutingRestFulService : fetch prompt details

  BillEditor --> ServiceGeneral : subscribes/publishes
  BillEditor --> ExecutingRestFulService : save prompts / fetch template

  BillData --> ServiceGeneral : subscribes/publishes
  BillData --> HttpClientService : send files / get extraction info
  BillData --> ExecutingRestFulService : save prompts / generate data

  BillDeletePrompt --> ServiceGeneral : subscribes
  BillDeletePrompt --> ExecutingRestFulService : delete entries

  ProcessTemplateBill --> ServiceGeneral : subscribes/publishes
  ProcessTemplateBill --> HttpClientService : set prompt for image generation
  ProcessTemplateBill --> ConvertBase64ByteService : (via other components) convert images

  BillVisualizer --> ServiceGeneral : subscribes to imageIds, image generation

  %% Service interactions
  ServiceGeneral --> ExecutingRestFulService : delegates REST actions
  ExecutingRestFulService --> HttpClientService : REST calls
  ReceiveDataService --> ServiceGeneral : pushes SSE tokens
  HttpClientService --> ConvertBase64ByteService : returns/accepts blobs

  %% Notes
  class ServiceGeneral {
    <<singleton>>
    +Observables: refreshPromptBills$, promptImages$, imageGenerated$, toastMessage$, ...
  }
  class ReceiveDataService {
    +getDataStream(request)
    +getDataStreamImage()
    +getDataStreamFile()
  }
```

Notes

- `ServiceGeneral` is the central event bus: most components subscribe to its Observables and publish events (refresh triggers, selected prompt updates, UI state like `setIsUploadingAnimation`).
- `ExecutingRestFulService` coordinates higher-level REST operations; it often calls `HttpClientService` to perform HTTP requests.
- `ReceiveDataService` provides server-sent/event-streams (SSE) used by streaming features and real-time prompt/image generation.
- Components typically follow the `takeUntil(destroy$)` subscription pattern to avoid memory leaks.

Location

- File: [system_architecture.md](system_architecture.md)
