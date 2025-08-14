# Artifacts
## Documents
- [Software Requirements Specification](https://github.com/Rostyslavsm/PRJ-666-GROUP-1-FRONTEND/blob/main/documents/SRS%20PRJ666.docx)
- [Final Presentation](https://github.com/Rostyslavsm/PRJ-666-GROUP-1-FRONTEND/blob/main/documents/Final%20Presentation.pptx)
- [The StudyPro Logo](https://github.com/Rostyslavsm/PRJ-666-GROUP-1-FRONTEND/blob/main/documents/StudyPro%20Logo.png)

## List of Deviations
No deviations were identified in this project.

## Installation Instructions
### Backend
#### 0. Prerequisites
- **Git**
- **Node.js 18**+ and **npm 9+**
#### 1. Clone the repository
``` bash
git clone https://github.com/kogun86/PRJ-666-GROUP-1-BACKEND.git
cd PRJ-666-GROUP-1-BACKEND
```
#### 2. Install dependencies
``` bash
npm install
```
#### 3. Environment configuration
Create a `.env.production` or `.env.development` file in the project root based on `.env.example`
``` ini
# --- Runtime ---
NODE_ENV=
LOG_LEVEL=

# --- Database ---
MONGO_URL=

# --- Authentication (AWS Cognito) ---
AWS_COGNITO_POOL_ID=
AWS_COGNITO_CLIENT_ID=

# --- AI Provider (OpenRouter) ---
OPENROUTER_API_KEY=
```
##### 3.2 About `NODE_ENV`
- `development`: enables dev tooling, verbose errors, hot reload.
- `production`: optimized builds, fewer logs.
##### 3.3 About `LOG_LEVEL`
Acceptable values: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent`.  
Start with `info` for production and `debug` during development.
#### 4. MongoDB Atlas - create a database & get a connection string
1. **Sign in / Create account**
    - Go to [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)
    - Sign up/sign in and create an **Organization** and **Project**.
2. **Create a Cluster**
    - Click **Build a Database** → choose **Free** (M0) → select a region (ideally near your users, e.g., Canada).
    - Keep defaults and **Create**.
3. **Create a Database User**
    - Atlas left sidebar → **Security** → **Database Access**.
    - **Add New Database User** → **Username/Password**.
    - Assign role **Atlas Admin** (for development) or **Read and write to any database**.
    - Save the username and password securely (you’ll need them for the URI).
4.  **Add IP Access**
    - **Network Access** → **Add IP Address**.
    - For development: **Allow Access from Anywhere** (`0.0.0.0/0`).
    - For production: allow only specific server IPs.
5. **Get the Connection String (URI)**
    - **Database** → **Connect** on your cluster → **Connect your application**.
    - Choose **Driver: Node.js**, version 4.x or higher.
    - Copy the URI (it looks like): `mongodb+srv://<username>:<password>@<clusterName>.mongodb.net/<dbName>?retryWrites=true&w=majority&appName=<appName>`
    - Replace:
        - `<username>` and `<password>` with the user you created.
        - `<dbName>` with `studypro` (or your preferred DB name).
6.  **Paste into `.env`**
#### 5. AWS Cognito - create a User Pool and get IDs
1. **Open Cognito**
    - Go to https://console.aws.amazon.com/cognito/ (pick the correct region, e.g., **Canada (ca-central-1)**).
2. **Create a User Pool**
    - **Create user pool** → Choose **Email** as a sign-in option (common choice).
    - Configure password policy (at least 8 chars, uppercase, number, special).
    - (Optional) Enable **MFA** and email verification (recommended for production).
    - **Create user pool**.
3. **Get the User Pool ID**
    - In the pool details page, copy the **User pool ID**.  
        Example: `ca-central-1_AbCdEf123`.
    - Put it in `.env`:
        `AWS_COGNITO_POOL_ID=ca-central-1_AbCdEf123`
4. **Create an App Client**
    - In the same user pool → **App integration** → **App clients** → **Create app client**.
    - Name it, e.g., `studypro-web`.
    - For a public single-page app (no server secret), **uncheck** “Client secret” (unless your backend can securely store it).
    - Configure allowed callback/logout URLs if you use hosted UI (e.g., `http://localhost:3000/callback` for dev).
    - **Create** → copy the **App client ID**, e.g., `1h57kf5cpq17m0eml12EXAMPLE`.
    - Put it in `.env`: `AWS_COGNITO_CLIENT_ID=1h57kf5cpq17m0eml12EXAMPLE`
#### 6. OpenRouter - get an API key
1. **Create account / Sign in**
    - Go to https://openrouter.ai/
2. **Create API Key**
    - Profile / Dashboard → **API Keys** → **Create Key**.
    - Copy the key (looks like `sk-or-v1-...`). Keep it secret.
3. **Paste into `.env`** 
`OPENROUTER_API_KEY=sk-or-v1-<REDACTED>`
#### 7. Run the application
### 7.1 Development

``` bash
npm run dev
```

- The app will start on the dev port `http://localhost:8080`.
- Logs should reflect `LOG_LEVEL` and `NODE_ENV=development`.
### 7.2 Production (local)

``` bash
npm start
```
