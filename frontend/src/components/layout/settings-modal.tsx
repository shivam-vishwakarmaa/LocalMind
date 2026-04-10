"use client"

import { useState, useEffect } from "react"
import { X, Cpu, Download, Loader2, Zap, Battery, Smartphone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [model, setModel] = useState("llama3.1")
  const [isSaving, setIsSaving] = useState(false)
  
  const [health, setHealth] = useState<{ram_gb: number, recommended_model: string, usage_percent: number} | null>(null)
  const [localIp, setLocalIp] = useState<string>("127.0.0.1")

  const [pulling, setPulling] = useState(false)
  const [pullStatus, setPullStatus] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8000/settings")
        .then(res => res.json())
        .then(data => setModel(data.ollama_model))
        .catch(err => console.error(err))
        
      fetch("http://localhost:8000/system-health")
        .then(res => res.json())
        .then(data => setHealth(data))
        .catch(err => console.error(err))

      fetch("http://localhost:8000/local-ip")
        .then(res => res.json())
        .then(data => setLocalIp(data.ip))
        .catch(err => console.error(err))
    }
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append("ollama_model", model)
    try {
      await fetch("http://localhost:8000/settings", { method: "POST", body: formData })
    } catch (err) {}
    setIsSaving(false)
    onClose()
  }
  
  const handlePullModel = async () => {
      setPulling(true)
      setPullStatus("Downloading... this may take a few minutes.")
      try {
          const res = await fetch("http://localhost:8000/pull-model", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({ model })
          })
          const data = await res.json()
          setPullStatus(data.status === "success" ? "Download complete!" : "Failed to download.")
      } catch (e) {
          setPullStatus("Failed to download model over API.")
      }
      setPulling(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border p-6 shadow-2xl flex flex-col md:flex-row gap-8">
        
        <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                Smart Settings
              </h2>
            </div>

            {health && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">System Memory (RAM)</p>
                        <div className="font-semibold">{health.ram_gb} GB Total</div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-blue-400 mb-1">Recommended Model</p>
                        <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm font-medium">
                            {health.recommended_model}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  AI Performance Profile
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button onClick={() => setModel(health?.recommended_model || "mistral")} className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1 ${['mistral', 'phi3'].includes(model) ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        <span className="flex items-center gap-2 font-medium text-sm"><Battery className="w-4 h-4"/> Power Saver</span>
                        <span className="text-xs text-muted-foreground">Faster on lower hardware. Uses Phi-3 or Mistral.</span>
                    </button>
                    <button onClick={() => setModel("llama3.1")} className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1 ${model === 'llama3.1' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        <span className="flex items-center gap-2 font-medium text-sm"><Zap className="w-4 h-4"/> High Accuracy</span>
                        <span className="text-xs text-muted-foreground">Premium context logic. Defaults to Llama 3.1.</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <select 
                      value={model} 
                      onChange={(e) => setModel(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="llama3.1">Llama 3.1</option>
                      <option value="mistral">Mistral (7B)</option>
                      <option value="phi3">Phi-3 (Mini)</option>
                      <option value="nomic-embed-text">Nomic Embed</option>
                    </select>
                    <button 
                        onClick={handlePullModel} 
                        disabled={pulling}
                        className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md flex items-center gap-2 text-sm disabled:opacity-50 transition-colors"
                    >
                        {pulling ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                        Download
                    </button>
                </div>
                {pullStatus && <p className="text-xs text-blue-400 mt-2">{pullStatus}</p>}
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 shadow-lg"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
        </div>

        {/* Mobile Portal Block */}
        <div className="w-full md:w-48 flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/10">
            <Smartphone className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-sm font-semibold mb-1 text-center">Mobile Study Portal</h3>
            <p className="text-xs text-center text-muted-foreground mb-4">Scan to review your flashcards on your phone.</p>
            
            <div className="bg-white p-2 rounded-lg mb-3">
                <QRCodeSVG value={`http://${localIp}:3000`} size={120} />
            </div>
            
            <p className="text-[10px] text-zinc-500 font-mono text-center overflow-hidden text-ellipsis w-full">http://{localIp}:3000</p>
        </div>

      </div>
    </div>
  )
}
