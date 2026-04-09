"use client"

import { useState, useEffect } from "react"
import { X, Cpu } from "lucide-react"

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [model, setModel] = useState("llama3.1")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8000/settings")
        .then(res => res.json())
        .then(data => setModel(data.ollama_model))
        .catch(err => console.error(err))
    }
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append("ollama_model", model)
    try {
      await fetch("http://localhost:8000/settings", {
        method: "POST",
        body: formData,
      })
    } catch (err) {
      console.error(err)
    }
    setIsSaving(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Hardware Settings
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Local Ollama Model
            </label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="llama3.1">Llama 3.1</option>
              <option value="mistral">Mistral</option>
              <option value="phi3">Phi-3</option>
              <option value="qwen2">Qwen 2</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Ensure you have pulled the model locally via `ollama run &lt;model&gt;` prior to use.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  )
}
