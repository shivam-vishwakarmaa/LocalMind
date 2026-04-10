"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { X, Check, Frown, Sparkles } from "lucide-react"

export function FlashcardPlayer({ 
    studySetId, 
    flashcards, 
    isGlobalReview = false 
}: { 
    studySetId?: number, 
    flashcards: any[],
    isGlobalReview?: boolean 
}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    
    if (!flashcards || flashcards.length === 0) return <div className="text-muted-foreground p-8 text-center border border-dashed border-border rounded-xl">No flashcards generated yet.</div>
    if (currentIndex >= flashcards.length) return <div className="text-emerald-400 font-medium p-8 text-center border border-dashed border-emerald-500/30 bg-emerald-500/10 rounded-xl">Deck Complete! Great Work.</div>

    const card = flashcards[currentIndex]
    
    // Resolve dynamic IDs if mapped globally
    const currentStudySetId = isGlobalReview ? card.study_set_id : studySetId
    const currentCardIndex = isGlobalReview ? card.card_index : currentIndex

    const handleScore = async (status: string, grade: number) => {
        try {
            await fetch(`http://localhost:8000/flashcards/${currentStudySetId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ card_index: currentCardIndex, status, grade })
            })
        } catch(e) {}
        
        setIsFlipped(false)
        setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
    }
    
    return (
        <div className="flex flex-col items-center max-w-xl mx-auto w-full animate-in fade-in duration-500">
            <div className="w-full text-right text-sm text-muted-foreground mb-4 font-medium">
                Card {currentIndex + 1} of {flashcards.length}
            </div>
            
            <div 
                className="w-full aspect-video min-h-[300px] perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={cn(
                    "w-full h-full relative preserve-3d transition-transform duration-500 rounded-xl",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden glass-card flex items-center justify-center p-8 text-center bg-card border-border shadow-2xl rounded-xl">
                        <h3 className="text-2xl font-medium">{card.front}</h3>
                        <p className="absolute bottom-4 text-xs text-muted-foreground">Click to flip</p>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 glass-card flex items-center justify-center p-8 text-center bg-primary/10 border-primary/20 shadow-2xl rounded-xl">
                        <p className="text-xl text-primary-foreground">{card.back}</p>
                    </div>
                </div>
            </div>
            
            <div className={cn("mt-8 flex md:flex-row flex-col gap-3 w-full transition-all duration-300", isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
                <button onClick={(e) => { e.stopPropagation(); handleScore('again', 0); }} className="flex-1 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 flex flex-col justify-center items-center gap-1 transition-colors font-medium">
                    <span className="flex items-center gap-1"><X className="w-4 h-4"/> Again</span>
                    <span className="text-[10px] opacity-70">1 min</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleScore('hard', 2); }} className="flex-1 py-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 flex flex-col justify-center items-center gap-1 transition-colors font-medium">
                    <span className="flex items-center gap-1"><Frown className="w-4 h-4"/> Hard</span>
                    <span className="text-[10px] opacity-70">1 day</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleScore('good', 4); }} className="flex-1 py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex flex-col justify-center items-center gap-1 transition-colors font-medium">
                    <span className="flex items-center gap-1"><Check className="w-4 h-4"/> Good</span>
                    <span className="text-[10px] opacity-70">3 days</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleScore('easy', 5); }} className="flex-1 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 flex flex-col justify-center items-center gap-1 transition-colors font-medium">
                    <span className="flex items-center gap-1"><Sparkles className="w-4 h-4"/> Easy</span>
                    <span className="text-[10px] opacity-70">7 days+</span>
                </button>
            </div>
        </div>
    )
}
