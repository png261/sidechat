import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SideChatProvider } from "@/provider"

const settings = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzMzMTg4LWZhY2QtNGFhZS1hNWVkLTc1ZDBhOTZhODVkOSJ9.FAb1swp9kNOYin52ofy-IlJqiR6xLdmWiu3eqEY9_wQ",
    apiUrl: "https://chat.hoclieu.vn",
}
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SideChatProvider settings={settings}>
            <App />
        </SideChatProvider>
    </React.StrictMode>,
)
