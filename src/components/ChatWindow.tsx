import ChatMessage from "./ChatMessage";
import type {Ref} from "react";
import type {Message} from "../types/types.ts";

interface Props {
    messages: Message[];
    isLoading: boolean;
    scrollRef: Ref<HTMLDivElement>;
}

export default function ChatWindow({messages, isLoading, scrollRef}: Props) {
    return (
        <div className="flex-1 overflow-y-auto bg-base-100 shadow rounded p-4 space-y-2">
            {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content}/>
            ))}

            {isLoading && (
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">
                        <span className="loading loading-dots loading-sm"></span>
                    </div>
                </div>
            )}

            <div ref={scrollRef}/>
        </div>
    );
}
