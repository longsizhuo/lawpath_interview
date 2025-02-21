This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
```text
/app
├── /api/graphql/route.ts  # GraphQL 端点 (Server)
├── /page.tsx              # 主页，加载 AddressForm 组件
/components
├── AddressForm.tsx        # 负责收集用户输入，并与 GraphQL 交互
/lib
├── apollo-client.ts       # Apollo Client 配置
```

# Bug Report
Error: React functionality 'useContext' is not available in this environment.

本质上，Apollo Client 的 useContext 不能在 Next.js 的 Server Component 运行，而 shadcn/ui 组件内部也使用了 useContext，这导致 Next.js 15 尝试在服务器端执行 React Hook，从而报错。

ApolloProvider 现在 只在浏览器端执行
避免 ApolloProvider 在服务器端初始化，防止 useContext 在服务器上运行