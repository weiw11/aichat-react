interface Props {
    role: "user" | "assistant" | "system";
    content: string;
}

export default function ChatMessage({role, content}: Props) {
    const match = content.match(/<think>([\s\S]*?)<\/think>/i);
    const visible = content.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
    const thought = match?.[1]?.trim();

    return (
        <div className={`chat ${role === "user" ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble ${role === "user" ? "" : "chat-bubble-primary"}`}>
                <div className="space-y-2">
                    {thought && (
                        <div className="collapse collapse-arrow bg-base-300">
                            <input type="checkbox"/>
                            <div className="collapse-title text-sm font-medium">AI Reasoning Thoughts</div>
                            <div className="collapse-content max-h-48 overflow-y-auto whitespace-pre-wrap text-sm">
                                {thought}
                            </div>
                        </div>
                    )}
                    {visible && <div className="whitespace-pre-wrap">{visible}</div>}
                </div>
            </div>
        </div>
    );
}
