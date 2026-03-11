---

# Tauri Timer App

A **desktop countdown timer application** built with **Tauri**, **Vue.js** and **Rust**,. It supports automatic countdown restart, notifications, and multi-platform support (Windows, Linux, macOS).

---

## Architecture Overview
### Backend
```
Frontend (Vue)
      ↓
Tauri Commands (Controller)
      ↓
CountdownService (Business Logic)
      ↓
TimerRepository (Persistence)
      ↓
Tauri Store (JSON-backed storage)
```

### Frontend
The frontend is built with Vue 3 + Vite and acts as a thin presentation layer over the Rust backend.

The UI follows `Atomic Design` principles and remains independent from infrastructure and persistence layers. All business logic is implemented in the Rust backend.

#### Design Principles

The frontend follows several architectural principles:
* Separation of concerns
* Inversion of Control
* Composition Root
* Thin View Layer
* Backend-driven business logic

The Vue application is responsible only for:
* Rendering timers
* Handling user input
* Invoking backend commands
* Updating reactive UI state

All timer scheduling, persistence, and notifications are handled in Rust.

#### Frontend Structure
src/
 ├─ adapters/
 │   └─ LuxonTimeAdapter.ts
 |   └─ TauryInvokeAdapter.ts
 ├─ repos/
 │   └─ TimerRepository.ts
 ├─ transports/
 |   └─ TauryTransport.ts
 |   └─ StorageTransport.ts
 ├─ components/
 │   ├─ composables/
 |   |    └─ useDateTime.ts
 |   |    └─ useTimersApi.ts
 |    ... // rest UI
 |
 ├─ mappers /
 |   └─ TimePapper.ts // toDomain <--> toStorage data mapping
 |
 └─ main.ts  // as initialision and composition

### Layers

* **Controller (Tauri commands)**
Exposes async commands to the frontend and orchestrates application services.

* **Services**
  Handles business logic:

  * Computes next active timer
  * Spawns thread for countdown
  * Sends notifications when a timer expires
  * Automatically restarts for the next timer

---



**Features:**

* Only one active countdown runs at a time.
* Automatically restarts after last active timer expires.
* Sends notifications on timer expiration.
* Supports manual restart when a new timer is added or removed.

#### Structure

```
src-tauri/
├─ lib.rs                 # App entry, Tauri setup, service management
├─ repositories/
│  └─ timer_repository.rs
├─ services/
│  ├─ countdown_service.rs
│  └─ notification_service.rs
├─ controllers/
│  └─ timer_controller.rs
```

---

### Architecture Decisions

* **Single source of truth**: Timers are persisted via `TimerRepository`.
* **Separation of concerns**: UI → Controller → Service → Repository → Store.
* **Thread-safe backend workers**: Only one thread per active timer, uses `Arc` to share service state.

---
