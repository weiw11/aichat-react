import {useEffect, useRef, useState} from 'react';
import './App.css'
import type {Message} from "./types/message.ts";

function App() {
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY || "");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollTargetRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollTargetRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    useEffect(() => {
        if (apiKey) {
            setTimeout(() => inputRef.current?.focus(), 0); // ensure render complete
        }
    }, [apiKey]);


    const sendMessage = async () => {
        if (!input.trim() || !apiKey.trim()) return;

        const updatedMessages: Message[] = [...messages, {role: "user", content: input}];
        setMessages(updatedMessages);
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
                    messages: updatedMessages,
                }),
            });

            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content || "";

            setMessages([...updatedMessages, {role: "assistant", content: reply}]);
        } catch {
            setMessages([...updatedMessages, {role: "assistant", content: "Error fetching response."}]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = (text: string) => {
        const match = text.match(/<think>([\s\S]*?)<\/think>/i);
        const visibleText = text.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
        const thinkText = match?.[1]?.trim();

        return (
            <div className="space-y-2">
                {thinkText && (
                    <div className="collapse collapse-arrow bg-base-300">
                        <input type="checkbox"/>
                        <div className="collapse-title text-sm font-medium">AI Reasoning Thoughts</div>
                        <div
                            className="collapse-content max-h-48 overflow-y-auto whitespace-pre-wrap text-sm">{thinkText}</div>
                    </div>
                )}
                {visibleText && <div>{visibleText}</div>}
            </div>
        );
    };

    return (
        <div className="h-screen overflow-hidden bg-base-200 flex flex-col items-center">
            <div className="w-full max-w-2xl flex flex-col h-full p-4 space-y-4">
                <h1 className="text-3xl font-bold">OpenAI Chatbot</h1>

                {!apiKey && (
                    <div className="card bg-base-100 p-4 shadow">
                        <h2 className="text-lg font-semibold mb-2">Enter OpenAI API Key</h2>
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                        />
                    </div>
                )}

                {apiKey && (
                    <>
                        <div className="flex-1 overflow-y-auto bg-base-100 shadow rounded p-4 space-y-2">
                            {messages.map((msg, i) => (
                                <div key={i} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                                    <div className={`chat-bubble ${msg.role === "user" ? "" : "chat-bubble-primary"}`}>
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="chat chat-start">
                                    <div className="chat-bubble chat-bubble-primary">
                                        <span className="loading loading-dots loading-sm"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={scrollTargetRef}/>

                        </div>

                        <div className="flex gap-2 pt-2">
                            <input
                                ref={inputRef}
                                type="text"
                                className="input input-bordered flex-1"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type your message..."
                                disabled={isLoading}
                            />
                            <button className="btn btn-primary" onClick={sendMessage} disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : "Send"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

}

export default App
