import {useEffect, useRef, useState, useCallback} from "react";
import APIKeyPrompt from "./components/APIKeyPrompt";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import type {Message} from "./types/types.ts";


function App() {
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY || "");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        if (apiKey) setTimeout(() => inputRef.current?.focus(), 0);
    }, [apiKey]);

    const addMessage = (role: Message["role"], content: string) => {
        setMessages((prev) => [...prev, {role, content}]);
    };

    const sendMessage = useCallback(async () => {
        if (!input.trim() || !apiKey.trim()) return;

        const updated: Message[] = [...messages, {role: "user", content: input}];
        setMessages(updated);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_AI_API_ENDPOINT}v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: import.meta.env.VITE_AI_MODEL,
                    messages: updated,
                }),
            });

            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content || "No response.";
            addMessage("assistant", reply);
        } catch {
            addMessage("assistant", "Error fetching response.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey, input, messages]);

    return (
        <div className="h-screen overflow-hidden bg-base-200 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col h-full p-4 space-y-4">
                <h1 className="text-3xl font-bold">OpenAI Chatbot</h1>

                {!apiKey ? (
                    <APIKeyPrompt onSetKey={setApiKey}/>
                ) : (
                    <>
                        <ChatWindow messages={messages} isLoading={isLoading} scrollRef={scrollRef}/>
                        <ChatInput
                            value={input}
                            onChange={setInput}
                            onSubmit={sendMessage}
                            isLoading={isLoading}
                            inputRef={inputRef}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
