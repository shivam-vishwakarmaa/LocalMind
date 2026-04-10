"use client"

import { useState } from "react"
import { HeroSection } from "@/components/dashboard/hero-section"
import { FlashcardPlayer } from "@/components/dashboard/flashcard-player"
import { QuizPlayer } from "@/components/dashboard/quiz-player"
import { ChatPanel } from "@/components/dashboard/chat-panel"
import { Download } from "lucide-react"
import { exportToMarkdown, exportToCSV } from "@/lib/export-utils"
import { cn } from "@/lib/utils"

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

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-500">
      <HeroSection />
      
      <div className="space-y-8">
        <div className="border-b border-border/50 flex justify-between items-center">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-muted-foreground hover:text-zinc-300 hover:border-zinc-700"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
            {/* Export Buttons */}
            <div className="flex gap-2">
                {activeTab === "Notes" && (
                    <button onClick={() => exportToMarkdown(mockNotes, "Notes")} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                        <Download className="w-4 h-4" /> Markdown
                    </button>
                )}
                {activeTab === "Flashcards" && (
                    <button onClick={() => exportToCSV(mockFlashcards, "Flashcards")} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white">
                        <Download className="w-4 h-4" /> Anki CSV
                    </button>
                )}
            </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8 transition-all">
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
            
            {/* Fallback for other tabs */}
            {!["Flashcards", "Quiz", "Notes"].includes(activeTab) && (
                 <div className="text-center text-muted-foreground p-12 border border-dashed border-white/10 rounded-xl glass-card">
                     Select a valid study set output or generate a new one above.
                 </div>
            )}
        </div>
      </div>
    </div>
  )
}
