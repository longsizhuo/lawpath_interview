# Address Validation Form (Next.js + Apollo + shadcn/ui + Zod + Three.js)

This project provides an address validation form that verifies Australian addresses using a GraphQL proxy.

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies
Ensure you have **Node.js 22** installed:
```bash
nvm install 22
npm install
```
### 2️⃣ Initialize UI Components

This project uses shadcn/ui, so initialize the UI components:
```bash
npx shadcn@latest init
npx shadcn@latest add button form input label
```
### 3️⃣ Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Now, open http://localhost:3000 in your browser. You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.
    
    If you feel animation is too noisy, you can click `Stop Animation` Button at right top to stop the animation.

## Folder Structure
```text
/app
   └─api
       └─graphql
               route.ts # graphql route
/components
   │  Form.tsx # form component
   │  GoogleMapComponent.tsx # google map component
   │  ThreeCanvas.tsx # three.js component
   │
   └─ui # shadcn ui
/lib
    apollo-client.ts # apollo client
    apollo-provider.tsx # apollo provider
    utils.ts # utils by shadcn
/public # some static files
```


## API Settings
To ensure the security of your API key and prevent it from being exposed in your codebase, it's essential to store it as an environment variable.
1. Rename `.env.template` to `.env`,
2. change the value of `API_KEY` to your own api key.


### ⚠️ Common Issues & Fixes

❌ Error: React functionality 'useContext' is not available

🔍 Cause: Apollo Client's useContext cannot run on Next.js Server Components.✅ Fix: Ensure ApolloProvider only runs in the browser.
```typescript jsx
"use client";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";

export default function MyApp({ children }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

### 📌 Notes

This project uses `Next.js`, `Apollo`, `shadcn`, `Zod`, and `Three.js`.

For database or backend requirements, ensure GraphQL proxy is running.

UI components are managed via shadcn/ui, make sure to initialize them.