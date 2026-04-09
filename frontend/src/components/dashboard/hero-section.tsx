import { UploadCloud, Link, FileText, Mic } from "lucide-react"

export function HeroSection() {
  const cards = [
    {
      title: "Upload PDF/Docs",
      icon: <UploadCloud className="w-6 h-6 text-blue-400" />,
      description: "Import syllabus or readings",
    },
    {
      title: "Link Videos/Articles",
      icon: <Link className="w-6 h-6 text-emerald-400" />,
      description: "Paste an external URL",
    },
    {
      title: "Paste Notes",
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      description: "Copy text directly",
    },
    {
      title: "Record Audio",
      icon: <Mic className="w-6 h-6 text-orange-400" />,
      description: "Capture lectures live",
    },
  ]

  return (
    <section>
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
