"use client"

import { useState, useEffect } from "react"
import { CalendarClock, ArrowRight } from "lucide-react"
import { FlashcardPlayer } from "./flashcard-player"

export function DueTodayWidget() {
    const [dueCards, setDueCards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [reviewing, setReviewing] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8000/due-today")
            .then(res => res.json())
            .then(data => {
                setDueCards(data.due || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return null
    if (!loading && dueCards.length === 0) return null

    if (reviewing) {
        return (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center p-8 animate-in fade-in">
                <div className="w-full max-w-4xl flex justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarClock className="text-orange-400" /> Daily Review (SM-2)
                    </h2>
                    <button onClick={() => { setReviewing(false); window.location.reload(); }} className="text-muted-foreground hover:text-white px-4 py-2 border rounded-md">Return to Dashboard</button>
                </div>
                <div className="flex-1 w-full flex items-center justify-center">
                    <FlashcardPlayer 
                        flashcards={dueCards.map(c => ({front: c.front, back: c.back, card_index: c.card_index, study_set_id: c.study_set_id}))} 
                        isGlobalReview={true} 
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="border border-orange-500/30 bg-orange-500/10 rounded-xl p-6 flex items-center justify-between shadow-lg mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                    <CalendarClock className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-orange-100">Daily Review Available</h3>
                    <p className="text-sm text-orange-200/70">You have {dueCards.length} flashcards scheduled for review today via SM-2 Algorithm.</p>
                </div>
            </div>
            <button onClick={() => setReviewing(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Start Session <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}
