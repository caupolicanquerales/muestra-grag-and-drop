# MuestraGragAndDrop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

# MuestraGragAndDrop

Comprehensive README for the MuestraGragAndDrop Angular project.

**Overview**

This is a frontend Angular application that provides a bill/template editor, prompt management, image generation and related utilities. The project uses Angular standalone components and integrates with backend REST endpoints and SSE streams.

**Prerequisites**

- Node.js (recommended >= 18)
- npm (recommended >= 8)
- Angular CLI (optional, globally installed for convenience)

**Quick start — install & run**

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
# or
ng serve
```

3. Open your browser at http://localhost:4200/.

**Available npm scripts**

- `npm start` — runs `ng serve` (development server)
- `npm run build` — builds the project (produces `dist/`)
- `npm run watch` — builds in watch mode
- `npm test` — runs unit tests (Karma)
- `npm run serve:ssr:muestra-grag-and-drop` — runs server-side bundle (if you built SSR)

**Project structure (selected)**

- `src/app/` — application code (components, services, utils)
- `src/assets/` — static assets
- `src/locale/` — localization messages
- `angular.json`, `package.json`, `tsconfig.json` — build and project config

**Tech stack & key dependencies**

- Angular 20 (Standalone components)
- TypeScript
- RxJS (reactive streams)
- PrimeNG / Prime icons (UI components)
- ngx-joyride (user tours)
- nanoid (id generation)
- Express (for SSR / server shipping)
- Zone.js

See `package.json` for the full dependency list.

**Development notes & conventions**

- Components prefer standalone mode and use typed Signals and RxJS streams.
- Subscriptions follow a `takeUntil(destroy$)` pattern to avoid leaks.
- UI components use PrimeNG; styles are in SCSS files adjacent to components.

**Testing**

- Unit tests use Karma + Jasmine. Run with `npm test`.

**Build & deploy**

- Production build:

```bash
npm run build -- --configuration production
```

- For SSR, build server and client bundles (see Angular build config), then run the produced server entrypoint using the `serve:ssr:muestra-grag-and-drop` script.

**Useful commands**

- Run type-check only: `npx tsc --noEmit`
- Run linter/formatter as configured in your environment (Prettier config in `package.json`).

**Contributing**

- Follow existing code patterns: keep changes focused and add tests for new logic.
- Respect component boundaries and avoid large sweeping refactors without tests.

**Troubleshooting**

- If build fails due to dependency versions, delete `node_modules` and `package-lock.json`, then `npm install`.
- For runtime SSE or backend-related failures, verify the backend endpoints and CORS configuration.

**License & contact**

This repository does not include a license file by default. Add an appropriate license if you plan to publish.

For questions about the code or architecture, open an issue in the project repository or contact the maintainer.

*** End of README ***
