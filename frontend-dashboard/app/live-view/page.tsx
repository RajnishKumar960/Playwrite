import { BrowserStreamView } from "@/components/browser-stream-view";

export default function LiveViewPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Agent Command Center</h1>
                <p className="text-slate-500 mt-2">Monitor and control your automation agents in real-time.</p>
            </div>

            <BrowserStreamView />
        </div>
    );
}
