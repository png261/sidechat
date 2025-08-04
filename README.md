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
