"use client"
import { useState } from "react"
import { Send, Sparkles } from "lucide-react"

export function ChatPanel({ studySetId }: { studySetId: number }) {
    const [query, setQuery] = useState("")
    const [history, setHistory] = useState<{role: string, text: string}[]>([])
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!query.trim() || !studySetId) return
        
        const q = query
        setHistory(prev => [...prev, {role: 'user', text: q}])
        setQuery("")
        setLoading(true)
        
        try {
            const res = await fetch(`http://localhost:8000/chat/${studySetId}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: q })
            })
            const data = await res.json()
            setHistory(prev => [...prev, {role: 'ai', text: data.answer || data.error}])
        } catch(e) {
            setHistory(prev => [...prev, {role: 'ai', text: "Failed to connect to AI."}])
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-[600px] border border-border rounded-xl bg-card/60 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-black/20 flex gap-2 items-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm tracking-wide text-zinc-200">Ask Document</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                {history.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-sm text-muted-foreground">
                        Confused? Ask the AI to summarize or find specific details from your study set!
                    </div>
                )}
                
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-xl max-w-[85%] text-sm shadow-sm leading-relaxed ${
                            msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white/10 text-zinc-200 rounded-bl-sm border border-white/5'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-xl bg-white/5 text-zinc-400 text-sm animate-pulse border border-white/5 rounded-bl-sm">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Search context..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={handleSend} disabled={loading || !studySetId} className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
