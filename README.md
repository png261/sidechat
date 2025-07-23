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

```javascript
import { ChatAgent } from 'sidechat'

const settings = {
  chat: {
    apiKey: "your-api-key-here",
    apiUrl: "your-api-url",
    model: "gpt-4",
  },
  general: {
    webpageContext: true,
  },
}

export default function Home() {
  return (
    <ChatAgent settings={settings}>
      {/* Your website content here */}
      <main>
        <h1>Welcome to My Website</h1>
        <p>This is your main content area.</p>
      </main>
    </ChatAgent>
  )
}
```
