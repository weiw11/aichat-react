import type {Ref} from "react";

interface Props {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    inputRef: Ref<HTMLInputElement>;
}

export default function ChatInput({value, onChange, onSubmit, isLoading, inputRef}: Props) {
    return (
        <div className="flex gap-2 pt-2">
            <input
                ref={inputRef}
                type="text"
                className="input input-bordered flex-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="Type your message..."
                disabled={isLoading}
            />
            <button className="btn btn-primary" onClick={onSubmit} disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner"></span> : "Send"}
            </button>
        </div>
    );
}
