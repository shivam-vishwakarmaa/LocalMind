"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

export function FlashcardPlayer({ studySetId, flashcards }: { studySetId: number, flashcards: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    
    if (!flashcards || flashcards.length === 0) return <div className="text-muted-foreground p-8 text-center border border-dashed border-border rounded-xl">No flashcards generated yet.</div>
    
    const card = flashcards[currentIndex]
    
    const handleScore = async (status: 'easy' | 'hard') => {
        try {
            await fetch(`http://localhost:8000/flashcards/${studySetId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ card_index: currentIndex, status })
            })
        } catch(e) {}
        
        setIsFlipped(false)
        if (currentIndex < flashcards.length - 1) {
            // Little delay to allow flip animation to reset
            setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
        } else {
            alert("Great job! You've reached the end of the deck.")
        }
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
            
            <div className={cn("mt-8 flex gap-4 w-full transition-all duration-300", isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
                <button onClick={(e) => { e.stopPropagation(); handleScore('hard'); }} className="flex-1 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 flex justify-center items-center gap-2 transition-colors font-medium">
                    <X className="w-4 h-4" /> Hard
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleScore('easy'); }} className="flex-1 py-3 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 flex justify-center items-center gap-2 transition-colors font-medium">
                    <Check className="w-4 h-4" /> Easy
                </button>
            </div>
        </div>
    )
}
