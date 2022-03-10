# template-google-cloud-functions

> A serverless monolithic REST API using Google Cloud Functions, Typescript and Express using some opinionated conventions.

## Templates inheritance

This template inherits conventions from [template-general](https://github.com/ggondim/template-general) -> [template-javascript](https://github.com/ggondim-templates-javascript/template-javascript) -> [template-typescript](https://github.com/ggondim-templates-typescript/template-typescript).

## Features
- **Debug local Google Cloud Functions with Typescript in vscode**
- Monolithic API using Express 4
- Express `async` controllers
- Automatic controller detection, no route files needed
- Typescript 4.6 linting
- OpenAPI definitions per controller, with automatic merging for the entire API
- Bugsnag logging in production, Morgan in development
- MongoDB connection injection through middleware, closing after process end
- Security middlewares (XSS, CORS, frames, etc.)
- Environment variables with @enx/env
- Conventional Commits and many other conventions

## Conventions

- Folder naming and architecture
- Files naming, enconding and styling
- Semantic Versioning
- Conventional commits
- Editor and recommended extensions

See all [CONVENTIONS.md](docs/CONVENTIONS.md).

## Linting

NPM task

```
$ npm run lint
```

vscode task

```
npm: lint
```

This template extends the following ESLint configurations plus manually override some rules:

- airbnb-base
- airbnb-typescript/base
- @typescript-eslint/recommended
- eslint-comments/recommended

See all [.eslintrc.js](.eslintrc.js) rules.

## Debugging

Set your breakpoints in TS files and then launch `Debug Google Cloud Function` configuration.

## Developing

This template uses an automatic detection of controller files and a single file definition for both route and controller.

1. Create your controller in `/src` folder with `.controller.ts` suffix.

2. Define your controller middleware and export it wrapped inside a factory function and `express-async-handler`:

```typescript
export default (app: Application) => app.get('/rota', asyncHandler(controller));
```

<details>
<summary>Controller full example</summary>

```typescript
import { Request, Response, Application } from 'express';
import asyncHandler from 'express-async-handler';

async function controller(
  req: Request,
  res: Response,
) {
  res.send(req.headers.accept);
}

export default (app: Application) => app.get('/route', asyncHandler(controller));

```
</details>

### Adding middlewares

You can add API-level middlewares using `app` variable inside `index.ts` file.

You can add endpoint-level middlewares just as any Express.js API, specifying an array of middleware handlers instead a single one:

```typescript
export default (app: Application) => app.get('/route', [ asyncHandler(middleware), asyncHandler(controller ]));
```
