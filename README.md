# 🚀 CompileSpace — Online Code Compiler with a Full GitOps CI/CD Pipeline

An online multi-language code compiler (**React + Judge0 API**), deployed through a complete, production-style **CI/CD & GitOps pipeline**: Docker → Jenkins → Argo CD → Kubernetes, across isolated **dev / staging / prod** environments — with automated Git-based rollbacks and a custom monitoring dashboard.

This repo is both a working app **and** a demonstration of how modern teams ship and operate software safely.

---

## 🌟 What This Project Demonstrates

This isn't just a compiler — it's an end-to-end DevOps pipeline built to mirror how real engineering teams deploy and recover from bad releases.

✅ **Multi-language code execution** – C++, Java, JavaScript, Python via Judge0 API  
✅ **Containerized app** – Dockerized frontend + Express server, multi-stage build  
✅ **CI pipeline** – Jenkins builds, tests, and pushes versioned Docker images on every commit  
✅ **GitOps CD** – Argo CD continuously reconciles 3 isolated Kubernetes environments (dev/staging/prod) from a single Git repo — zero manual `kubectl apply`  
✅ **One-command rollback** – a bad release is undone with a single `git revert`; Argo CD self-heals the cluster automatically  
✅ **Custom ops dashboard** – a purpose-built Express + React dashboard showing live pod health and Argo CD sync status per environment, with a working one-click rollback button  
✅ **Zero-downtime deploys** – Kubernetes rolling updates keep the previous healthy pod serving traffic throughout any failed deployment

---

## 🏗️ Architecture

<!-- Add the architecture diagram image below -->

<br><br><br><br>

---

## 🔁 The Rollback Story

The core of this project: proving that in a GitOps workflow, **undoing a bad deploy is never a scramble** — it's a single, auditable Git operation.

1. A broken image tag is pushed to `prod` via a Git commit
2. Kubernetes attempts a rolling update — the new pod fails (`ImagePullBackOff`), but **the previous healthy pod keeps serving traffic the entire time** — zero downtime
3. `git revert` undoes the bad commit (preserving history — unlike `git reset`)
4. Argo CD detects the change and **self-heals** the cluster back to the last known-good state, automatically
5. The custom dashboard's `/api/rollback/:env` endpoint automates this entire flow behind a single button

No manual `kubectl` commands touch the cluster during rollback — Git is the single source of truth.

---

## 📦 Repositories

| Repo | Purpose |
|---|---|
| `Code-Comipler-Judge0` (this repo) | The compiler app source — React frontend + Express server |
| `gitops-config` | Kubernetes manifests for dev/staging/prod, watched by Argo CD |
| `dashboard-backend` | Express API wrapping the Kubernetes + Argo CD APIs, plus the automated rollback endpoint |

---

## 🛠️ Tech Stack

**Application**
- React (Vite) + CodeMirror
- Express (serves the built frontend + `/health`, `/version` endpoints)
- Judge0 API for sandboxed code execution
- Docker (multi-stage build)

**CI/CD & Infrastructure**
- Jenkins — build, test, push versioned Docker images
- Argo CD — GitOps continuous delivery, auto-sync + self-heal
- Kubernetes (`kind`) — dev/staging/prod as isolated namespaces
- Git — single source of truth for all environment state

**Ops Dashboard**
- Express + `@kubernetes/client-node` — live pod/version status
- Axios — Argo CD REST API integration
- `simple-git` — programmatic Git revert for one-click rollback
- React frontend — env health cards + rollback controls

---

## 🚀 Running the Compiler App Locally

### 1️⃣ Clone the repo
```sh
git clone https://github.com/aryantamboli770/Code-Comipler-Judge0.git
cd Code-Comipler-Judge0
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Add your Judge0 API key
Create a `.env` file in the project root:
```env
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
```

### 4️⃣ Run it
```sh
npm run dev
```
The app will be live at `http://localhost:5173` 🚀

---

## 🐳 Running via Docker

```sh
docker build -t code-compiler .
docker run -p 3000:3000 -e APP_VERSION=v1 code-compiler
```

---

## 📌 How to Use the Compiler

1. Select a programming language
2. Write or paste your code
3. Click **Run**
4. View the output instantly in the terminal-style output panel

---

## 🔒 Security Note

API keys are loaded via environment variables (`VITE_RAPIDAPI_KEY`) and are never committed to source control. If you fork this repo, generate your own Judge0/RapidAPI key rather than reusing any key found in commit history.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Clone** it locally:
```sh
   git clone https://github.com/aryantamboli770/Code-Comipler-Judge0.git
```
3. **Create a branch:**
```sh
   git checkout -b feature-branch
```
4. **Commit your changes:**
```sh
   git commit -m "Added new feature"
```
5. **Push and open a PR:**
```sh
   git push origin feature-branch
```

---

## 🙌 Credits

Originally forked from [yash-borkar/Code-Comipler-Judge0](https://github.com/yash-borkar/Code-Comipler-Judge0). Extended with a full Docker → Jenkins → Argo CD GitOps pipeline, multi-environment Kubernetes deployment, automated rollback tooling, and a custom operations dashboard by **Aryan Tamboli**.

---

⭐ **Star this repo** if the CI/CD story here was useful to you!
