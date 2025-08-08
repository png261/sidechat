import endent from 'endent';
import {
    AIMessage,
    HumanMessage,
    SystemMessage,
} from '@langchain/core/messages';
import { useState } from 'react';
import { ChatRole, useCurrentChat } from './useCurrentChat';
import type { MessageDraft } from './useMessageDraft';

interface UseChatCompletionProps {
    model: string;
    apiKey: string;
    apiUrl: string;
}

let controller: AbortController;

export const useChatCompletion = ({
    model,
    apiKey,
    apiUrl,
}: UseChatCompletionProps) => {
    const {
        messages,
        updateAssistantMessage, // This is no longer used, but kept for context.
        addNewMessage,
        commitToStoredMessages,
        clearMessages,
        removeMessagePair,
    } = useCurrentChat();

    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitQuery = async (message: MessageDraft, context?: string) => {
        if (generating) return;

        await addNewMessage(ChatRole.USER, message);
        controller = new AbortController();

        setError(null);
        setGenerating(true);

        try {
            const expandedQuery = context
                ? endent`
            ### Context
            ${context}
            ### Question:
            ${message.text}
          `
                : message.text;

            const messagesToSend = [
                ...messages.map((msg) => {
                    switch (msg.role) {
                        case ChatRole.ASSISTANT:
                            return new AIMessage(msg.content);
                        case ChatRole.SYSTEM:
                            return new SystemMessage(msg.content);
                        case ChatRole.USER:
                            return new HumanMessage(msg.content);
                        default:
                            return new HumanMessage(msg.content);
                    }
                }),
                new HumanMessage({
                    content: expandedQuery,
                }),
            ];

            const response = await fetch(`${apiUrl}/api/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    'files': [{ 'type': 'collection', 'id': "Dialy9" }],
                    "tool_ids": [ "spyci" ],
                    messages: messagesToSend.map((m) => {
                        if (m instanceof SystemMessage) {
                            return { role: 'system', content: m.content };
                        } else if (m instanceof HumanMessage) {
                            return { role: 'user', content: m.content };
                        } else if (m instanceof AIMessage) {
                            return { role: 'assistant', content: m.content };
                        } else {
                            return { role: 'user', content: String(m) };
                        }
                    }),
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            // Get the full JSON response
            const data = await response.json();
            console.log(data)
            const fullContent = data?.choices?.[0]?.message?.content || 'No response.';

            // Add the complete assistant message to the chat state
            await addNewMessage(ChatRole.ASSISTANT, { text: fullContent });

        } catch (e) {
            setError(e as Error);
        } finally {
            commitToStoredMessages();
            setGenerating(false);
        }
    };

    const cancelRequest = () => {
        controller?.abort();
        commitToStoredMessages();
        setGenerating(false);
    };

    return {
        messages,
        submitQuery,
        generating,
        cancelRequest,
        clearMessages,
        removeMessagePair,
        error,
    };
};
