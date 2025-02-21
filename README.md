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
├── /api/graphql/route.ts 
├── /page.tsx             
/components
├── Form.tsx        
/lib
├── apollo-client.ts 
```

# Bug Report
Error: React functionality 'useContext' is not available in this environment.

本质上，Apollo Client 的 useContext 不能在 Next.js 的 Server Component 运行，而 shadcn/ui 组件内部也使用了 useContext，这导致 Next.js 15 尝试在服务器端执行 React Hook，从而报错。

ApolloProvider 现在 只在浏览器端执行
避免 ApolloProvider 在服务器端初始化，防止 useContext 在服务器上运行

# API Settings
To ensure the security of your API key and prevent it from being exposed in your codebase, it's essential to store it as an environment variable. Below are the steps to set an environment variable named `API_KEY` on different operating systems:

**Windows:**

1. **Using System Properties:**
    - Press `Win + Q` and type "Edit the system environment variables," then press Enter.
    - In the System Properties window, click on "Environment Variables."
    - Under the "User variables" section, click "New."
    - Enter `API_KEY` as the variable name and your actual API key as the variable value.
    - Click "OK" to save the changes.

2. **Using Command Prompt:**
    - Open Command Prompt.
    - Run the following command (replace `your_api_key` with your actual API key):
      ```
      setx API_KEY "your_api_key"
      ```
    - Restart Command Prompt to apply the changes.

**macOS and Linux:**

1. **Determine Your Shell:**
    - Open Terminal.
    - Run:
      ```
      echo $SHELL
      ```
    - If the output ends with `/bash`, you're using Bash; if it ends with `/zsh`, you're using Zsh.

2. **For Bash Users:**
    - Open Terminal.
    - Run:
      ```
      nano ~/.bash_profile
      ```
    - Add the following line to the file (replace `your_api_key` with your actual API key):
      ```
      export API_KEY="your_api_key"
      ```
    - Save and exit the editor.
    - Run:
      ```
      source ~/.bash_profile
      ```

3. **For Zsh Users:**
    - Open Terminal.
    - Run:
      ```
      nano ~/.zshrc
      ```
    - Add the following line to the file (replace `your_api_key` with your actual API key):
      ```
      export API_KEY="your_api_key"
      ```
    - Save and exit the editor.
    - Run:
      ```
      source ~/.zshrc
      ```

**Accessing the Environment Variable in Your Application:**

In your application code, you can access the `API_KEY` environment variable using:


```javascript
const apiKey = process.env.API_KEY;
```


Ensure that your application has access to environment variables and that they are correctly configured in your deployment environment.

**Important Security Note:**

After setting your API key as an environment variable, ensure that your code does not contain hard-coded API keys. Additionally, avoid committing sensitive information to version control systems. Regularly review your codebase and version history to prevent accidental exposure of sensitive data.

For more detailed information, refer to the following resources:

- [Storing API keys as Environmental Variable for Windows, Linux and Mac](https://gargankush.medium.com/storing-api-keys-as-environmental-variable-for-windows-linux-and-mac-and-accessing-it-through-974ba7c5109f)
- [How to work with environment variables on Windows/Linux](https://stackoverflow.com/questions/74672366/how-to-work-with-environment-variables-on-windows-linux)
- [Set API key as an environment variable in Alibaba Cloud Model Studio](https://www.alibabacloud.com/help/en/model-studio/developer-reference/configure-api-key-through-environment-variables) 