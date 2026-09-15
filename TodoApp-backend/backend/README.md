# TodoApp Backend (NestJS + MongoDB)

Task storage API for the TodoApp mobile app. Authentication itself is
still handled entirely by Firebase on the mobile side — this backend's
job is to verify the Firebase ID token attached to each request and
store/retrieve that user's tasks in MongoDB.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up MongoDB

- **Local**: install MongoDB Community Server and use
  `mongodb://localhost:27017/todoapp`, or
- **Atlas** (easier, free tier): create a cluster at
  [mongodb.com/atlas](https://www.mongodb.com/atlas), get the connection
  string, and use that as `MONGO_URI`.

## 3. Set up Firebase Admin credentials

1. In the Firebase Console, go to **Project Settings → Service Accounts**.
2. Click **Generate new private key** — this downloads a JSON file.
3. Save it in this project (e.g. as `firebase-service-account.json`) —
   it's already in `.gitignore`, do not commit it.

## 4. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

```
MONGO_URI=<your MongoDB connection string>
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
PORT=3000
```

## 5. Run it

```bash
npm run start:dev
```

The API will be live at `http://localhost:3000`.

> **Note on connecting from the mobile app**: an Android emulator can't
> reach your machine via `localhost` — use `http://10.0.2.2:3000` instead
> (this is the emulator's alias for the host machine's localhost). A
> physical device needs your machine's LAN IP instead.

## API reference

Every endpoint below requires a header:
```
Authorization: Bearer <Firebase ID token>
```
The mobile app gets this token via `auth().currentUser.getIdToken()`.

| Method | Endpoint      | Description                                   |
|--------|---------------|------------------------------------------------|
| POST   | `/tasks`      | Create a task                                  |
| GET    | `/tasks`      | List the current user's tasks (see query params below) |
| GET    | `/tasks/:id`  | Get a single task                              |
| PATCH  | `/tasks/:id`  | Update a task (e.g. toggle `completed`)        |
| DELETE | `/tasks/:id`  | Delete a task                                  |

### GET /tasks query params

- `completed=true|false` — filter by completion state
- `priority=low|medium|high` — filter by priority
- `tag=<tag>` — filter by a single tag
- `sortBy=smart|deadline|priority|created` — sort mode (default: `smart`)

`sortBy=smart` uses a scoring algorithm (see
`src/tasks/utils/sort-tasks.util.ts`) that blends priority and how close
(or overdue) the deadline is, so a low-priority task due in 20 minutes
can still outrank a high-priority task due next week — while completed
tasks always sort to the bottom.

### Task shape

```json
{
  "title": "Finish report",
  "description": "Q3 summary for the team",
  "dateTime": "2026-09-14T09:00:00.000Z",
  "deadline": "2026-09-15T17:00:00.000Z",
  "priority": "high",
  "tags": ["work", "urgent"],
  "completed": false
}
```

`userId`, `createdAt`, and `updatedAt` are set/managed by the server —
don't send them in requests.

## Project structure

```
src/
  main.ts                        Bootstrap: CORS + global validation
  app.module.ts                   Root module: config + Mongo connection
  auth/
    firebase-admin.provider.ts     Initializes Firebase Admin SDK once
    firebase-auth.guard.ts          Verifies the Bearer token on protected routes
    decorators/current-user.decorator.ts   @CurrentUser() param decorator
    auth.module.ts
  tasks/
    schemas/task.schema.ts          Mongoose schema
    dto/
      create-task.dto.ts
      update-task.dto.ts
      query-tasks.dto.ts
    enums/priority.enum.ts
    utils/sort-tasks.util.ts        The smart sort algorithm
    tasks.service.ts                 DB access, always scoped by userId
    tasks.controller.ts              REST endpoints (all guarded)
    tasks.module.ts
```

## What's next

With this running, the mobile app's next phase is:
- `services/taskService.ts` — calls these endpoints, attaching the
  Firebase ID token as a Bearer header
- Replacing the placeholder `TaskListScreen` with the real UI (fetch,
  display, filter/sort controls, swipe-to-delete)
- `AddEditTaskScreen` for creating/editing tasks
