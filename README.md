
# BigColumn Cassandra Demo

A self‑contained Docker stack that showcases how to build a **CRUD REST API** on top of an Apache Cassandra cluster using Node.js + TypeScript, complete with automatic dataset seeding, Swagger docs and unit tests with Jest.



## ✨ Key Features

* **Masterless DB** – single‐node Cassandra 4.1 (can be scaled horizontally).
* **TypeScript API** – Express 5 with full type‑safety.
* **Swagger UI** – interactive docs at `/api-docs`.
* **Autoseed** – sample data loaded on start‑up (`data/datasetUsers.json`).
* **Unit tests** – pure repository layer tests (`npm run test`).
* **One‑shot build** – `npm run build` compiles TS and spins every container.



## 📦 Project Layout

```
.
├── data/                 # JSON seed
├── src/
│   ├── cassandraClient.ts
│   ├── index.ts          # repository layer
│   ├── routes.ts         # Express routes
│   ├── server.ts
│   └── swagger.yaml
├── tests/                # Jest unit tests
├── Dockerfile
├── docker-compose.yml
└── README.md
```



## 🚀 Quick Start

```bash
# clone
git clone https://github.com/granchetti/cassandra-project.git
cd cassandra-project

# install deps for host tasks (optional)
npm install

# build + run the whole stack
npm run build            # alias of: docker compose up --build
```

*Swagger*: browse **http://localhost:3000/api-docs** after containers are healthy.



## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run build:ts` | Transpile TypeScript → `dist/` |
| `npm run build` | Full Docker build & up |
| `npm start` | Run API locally against local Cassandra |
| `npm run seed` | Re‑seed DB (inside container) |
| `npm test` | Spin Cassandra → run Jest → tear down |



## 🐳 Docker Compose Overview

| Service | Image | Purpose | Ports |
|---------|-------|---------|-------|
| `cassandra` | `cassandra:4.1` | Big‑Column database | 9042 |
| `app` | built from `Dockerfile` | REST API | 3000 |
| `seed` | same as app (one‑shot) | Load `datasetUsers.json` | – |

Scale Cassandra to 3 nodes:

```bash
docker compose up --scale cassandra=3
```



## 🧪 Testing

```bash
npm run test
```

The script:

1. Boots a temporary Cassandra container.
2. Waits until CQL is available.
3. Runs Jest **unit tests** (repository layer only).
4. Shuts everything down.



## 📄 API Endpoints

> Full schema in `swagger.yaml` & Swagger UI.

| Method | Path | Description |
|--------|------|-------------|
| **POST** | `/users` | Create user |
| **GET** | `/users` | List users |
| **GET** | `/users/:id` | Get by ID |
| **PUT** | `/users/:id` | Update name & age |
| **DELETE** | `/users/:id` | Delete |



## 📚 Learn More

* Apache Cassandra – <https://cassandra.apache.org/>
* Express.js 5 – <https://expressjs.com/>
* Jest – <https://jestjs.io/>
* Swagger UI – <https://swagger.io/tools/swagger-ui/>

