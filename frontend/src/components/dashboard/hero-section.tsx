"use client"

import { UploadCloud, Link as LinkIcon, FileText, Mic, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

export function HeroSection() {
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusText, setStatusText] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setStatusText("Uploading & Extracting Text...")
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      
      if (data.id) {
        setStatusText("Driving 7-Way AI Generation...")
        setIsGenerating(true)
        
        const genRes = await fetch(`http://localhost:8000/generate/${data.id}`, { method: "POST" })
        if (genRes.body) {
            const reader = genRes.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value)
                const lines = chunk.split("\n")
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const parsed = JSON.parse(line.replace("data: ", ""))
                            if (parsed.status === "progress") {
                                setStatusText(`[${parsed.step}/${parsed.total}] ${parsed.current_task}...`)
                            } else if (parsed.status === "complete") {
                                setStatusText("Complete!")
                            }
                        } catch (e) {}
                    }
                }
            }
        }
        
        setTimeout(() => {
            setIsUploading(false)
            setIsGenerating(false)
            setStatusText("")
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      setStatusText("Failed.")
      setTimeout(() => setIsUploading(false), 2000)
    }
  }

  const cards = [
    {
      title: "Upload PDF/Docs",
      icon: <UploadCloud className="w-6 h-6 text-blue-400" />,
      description: "Import syllabus or readings",
      onClick: () => fileInputRef.current?.click()
    },
    {
      title: "Link Videos/Articles",
      icon: <LinkIcon className="w-6 h-6 text-emerald-400" />,
      description: "Paste an external URL",
      onClick: () => alert("YouTube link input UI would open here")
    },
    {
      title: "Paste Notes",
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      description: "Copy text directly",
      onClick: () => alert("Text area input UI would open here")
    },
    {
      title: "Record Audio",
      icon: <Mic className="w-6 h-6 text-orange-400" />,
      description: "Capture lectures live",
      onClick: () => fileInputRef.current?.click() // Route to file input for audio file for MVP
    },
  ]

  return (
    <section className="relative">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept=".pdf,.mp3,.wav,.m4a,.mp4,.txt"
      />
      
      {isUploading && (
        <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-white/10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-4" />
          <p className="text-lg font-medium">{statusText}</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Time to <span className="gradient-text">study smarter</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Instantly transform your study materials into interactive flashcards, quizzes, and podcasts using LocalMind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <button 
            key={idx} 
            onClick={card.onClick}
            className="glass-card text-left p-6 rounded-xl group flex flex-col justify-between min-h-[140px]"
          >
            <div className="mb-4 bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all">
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">{card.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{card.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
