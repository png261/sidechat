# SideChat
## Installation
```bash
npm install sidechat
# or
yarn add sidechat
# or
pnpm add sidechat
```
## Usage

To initialize SideChat with your API settings, wrap your application with the SideChatProvider at the root level.
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SideChatProvider } from 'sidechat'  // or your actual provider path

const settings = {
  apiKey: "your-api-key-here",
  apiUrl: "https://your-api-url.com",
  // Optional: add model or other config if needed
  model: "gpt-4",
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SideChatProvider settings={settings}>
      <App />
    </SideChatProvider>
  </React.StrictMode>
)
```
Then, you can now use SideChat components or hooks anywhere inside the provider context.

```javascript
import { SideChat } from 'sidechat'

const settings = {
    apiKey: "your-api-key-here",
    apiUrl: "your-api-url",
    model: "gpt-4",
}

export default function Home() {
  return (
    <SideChat settings={settings}>
      {/* Your website content here */}
      <main>
        <h1>Welcome to My Website</h1>
        <p>This is your main content area.</p>
      </main>
    </SideChat>
  )
}
```
