import { SideChat } from "@/components"
import './index.css';

const settings = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzMzMTg4LWZhY2QtNGFhZS1hNWVkLTc1ZDBhOTZhODVkOSJ9.FAb1swp9kNOYin52ofy-IlJqiR6xLdmWiu3eqEY9_wQ",
    apiUrl: "https://chat.hoclieu.vn",
    model: "sidechat",
}


export default function Home() {
    return (
        <SideChat settings={settings}>
        </SideChat>
    );
}

