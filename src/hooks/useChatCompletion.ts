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
    systemPrompt: string;
}

let controller: AbortController;

export const useChatCompletion = ({
    model,
    apiKey,
    apiUrl,
    systemPrompt,
}: UseChatCompletionProps) => {
    const {
        messages,
        updateAssistantMessage,
        addNewMessage,
        commitToStoredMessages,
        clearMessages,
        removeMessagePair,
    } = useCurrentChat();

    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitQuery = async (message: MessageDraft, context?: string) => {
        // Prevent duplicate submissions while generating
        if (generating) return;

        // Add user message only once
        await addNewMessage(ChatRole.USER, message);
        controller = new AbortController();
        const options = {
            signal: controller.signal,
            callbacks: [{ handleLLMNewToken: updateAssistantMessage }],
        };

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

            // Construct messages array with system prompt and current message
            const messagesToSend = [
                new SystemMessage(systemPrompt),
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
                    content:
                        message.files.length > 0
                            ? [
                                { type: 'text', text: expandedQuery },
                                ...(
                                    await Promise.all(
                                        message.files.map(async (file) => ({
                                            type: 'image_url',
                                            image_url: { url: file.src },
                                        })),
                                    )
                                ),
                            ]
                            : expandedQuery,
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
                signal: options.signal,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content || 'No response.';

            // Simulate streaming without splitting into tokens
            await new Promise((resolve) => setTimeout(() => {
                options.callbacks?.[0].handleLLMNewToken(content);
                resolve(null);
            }, 60));
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
