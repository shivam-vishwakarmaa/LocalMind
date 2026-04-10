"use client"

import { useState } from "react"
import { HeroSection } from "@/components/dashboard/hero-section"
import { FlashcardPlayer } from "@/components/dashboard/flashcard-player"
import { QuizPlayer } from "@/components/dashboard/quiz-player"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { Download, DatabaseBackup, Loader2 } from "lucide-react"
import { exportToMarkdown, exportToCSV } from "@/lib/export-utils"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { DueTodayWidget } from "@/components/dashboard/due-today"

const tabs = ["Notes", "Flashcards", "Quiz", "Short Answer", "Key Terms", "Podcast"]

export default function Home() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  
  // Mock Data (in a real app, this would be fetched from the API based on current studySetId)
  const mockStudySetId = 1
  const mockFlashcards = [
      { front: "What is RAG?", back: "Retrieval-Augmented Generation" },
      { front: "Why use ChromaDB?", back: "It's a fast, local vector database." }
  ]
  const mockQuizzes = [
      { question: "Which tool downloads YouTube audio?", options: ["PyMuPDF", "yt-dlp", "faster-whisper"], answer: "yt-dlp" }
  ]
  const mockNotes = "# LocalMind Architecture\n\nThis system uses FastAPI and Next.js to provide an offline intelligence layer."

  const handleBackup = async () => {
      try {
          const res = await fetch("http://localhost:8000/backup")
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "localmind_backup.zip"
          a.click()
          URL.revokeObjectURL(url)
      } catch (e) {
          alert("Backup failed.")
      }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-500">
      <HeroSection />
      
      <DueTodayWidget />

      <div className="space-y-8">
        <div className="border-b border-white/10 flex justify-between items-center">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative",
                    activeTab === tab
                      ? "text-blue-400"
                      : "border-transparent text-muted-foreground hover:text-zinc-300 hover:border-zinc-700"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                      <motion.div layoutId="tab-indicator" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex gap-2">
                <button 
                    onClick={handleBackup} 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 rounded-md transition-colors mr-2"
                >
                    <DatabaseBackup className="w-4 h-4" /> Backup DB
                </button>

                {activeTab === "Notes" && (
                    <button onClick={() => exportToMarkdown(mockNotes, "Notes")} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white border border-white/10">
                        <Download className="w-4 h-4" /> Markdown
                    </button>
                )}
                {activeTab === "Flashcards" && (
                    <button onClick={() => exportToCSV(mockFlashcards, "Flashcards")} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white border border-white/10">
                        <Download className="w-4 h-4" /> Anki CSV
                    </button>
                )}
            </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8 transition-all min-h-[400px]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "Flashcards" && <FlashcardPlayer studySetId={mockStudySetId} flashcards={mockFlashcards} />}
                    
                    {activeTab === "Quiz" && <QuizPlayer studySetId={mockStudySetId} quizzes={mockQuizzes} />}
                    
                    {activeTab === "Notes" && (
                        <div className="flex gap-8 items-start flex-col lg:flex-row">
                            <div className="flex-1 glass-card p-8 rounded-xl min-h-[600px] w-full">
                                <h2 className="text-xl font-bold mb-4">Generated Notes</h2>
                                <div className="prose prose-invert max-w-none text-zinc-300">
                                    <p>{mockNotes}</p>
                                    <p className="mt-4 text-sm text-zinc-500 italic">Try highlighting text! (Clarify feature hooks to Ollama backend via selection bounding box)</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-[400px] flex-shrink-0 sticky top-8">
                                <ChatPanel studySetId={mockStudySetId} />
                            </div>
                        </div>
                    )}
                    
                    {/* Fallback for other tabs - Show Skeleton Loader to simulate DB fetching */}
                    {!["Flashcards", "Quiz", "Notes"].includes(activeTab) && (
                         <div className="w-full max-w-4xl mx-auto space-y-4">
                             <div className="h-8 bg-white/5 animate-pulse rounded-md w-1/3 mb-8"></div>
                             <div className="h-24 bg-white/5 animate-pulse rounded-xl w-full"></div>
                             <div className="h-24 bg-white/5 animate-pulse rounded-xl w-full"></div>
                             <div className="h-24 bg-white/5 animate-pulse rounded-xl w-3/4"></div>
                         </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
