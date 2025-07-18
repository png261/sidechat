import { ChatAgent } from "@/components/ChatAgent"
import './tailwind/theme.css'


const settings = {
    chat: {
        openAIKey: "AIzaSyAD-ThFyNEnM768sKwCbDmIMcMfC3epPvs",
        model: "",
        mode: "",
        openAiBaseUrl: "",
    },
    general: {
        webpageContext: true
    }
}


export default function Home() {
    return (
        <ChatAgent settings={settings}>
            this is another text
        </ChatAgent>
    );
}


