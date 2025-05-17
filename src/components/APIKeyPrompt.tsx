interface Props {
    onSetKey: (key: string) => void;
}

export default function APIKeyPrompt({onSetKey}: Props) {
    return (
        <div className="card bg-base-100 p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Enter OpenAI API Key</h2>
            <input
                type="password"
                className="input input-bordered w-full"
                onChange={(e) => onSetKey(e.target.value)}
                placeholder="sk-..."
            />
        </div>
    );
}
