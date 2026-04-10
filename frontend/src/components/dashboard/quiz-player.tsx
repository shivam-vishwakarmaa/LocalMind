"use client"
import { useState } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function QuizPlayer({ studySetId, quizzes }: { studySetId: number, quizzes: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null)
    const [isEvaluated, setIsEvaluated] = useState(false)
    const [explanation, setExplanation] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    
    if (!quizzes || quizzes.length === 0) return <div className="text-muted-foreground p-8 text-center border border-dashed border-border rounded-xl">No quiz generated yet.</div>
    const q = quizzes[currentIndex]
    
    const handleCheck = async () => {
        setIsEvaluated(true)
        if (selectedOpt !== q.answer) {
            setIsThinking(true)
            try {
                const res = await fetch("http://localhost:8000/clarify", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: `For the question '${q.question}', explain briefly why the selected answer '${selectedOpt}' is incorrect, and why the true answer '${q.answer}' is correct.` })
                })
                const data = await res.json()
                setExplanation(data.answer)
            } catch(e) {}
            setIsThinking(false)
        }
    }
    
    return (
        <div className="max-w-xl mx-auto w-full glass-card p-8 rounded-xl animate-in fade-in duration-500">
             <div className="text-sm font-medium text-blue-400 mb-2">Question {currentIndex + 1} of {quizzes.length}</div>
             <h3 className="text-xl font-bold mb-6 text-zinc-100 leading-relaxed">{q.question}</h3>
             
             <div className="space-y-3 mb-8">
                 {q.options.map((opt: string, idx: number) => (
                     <button 
                        key={idx}
                        onClick={() => !isEvaluated && setSelectedOpt(opt)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedOpt === opt ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-black/20 hover:bg-white/5'
                        } ${isEvaluated && opt === q.answer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-100' : ''}
                          ${isEvaluated && selectedOpt === opt && opt !== q.answer ? 'border-red-500 bg-red-500/10 text-red-100' : ''}
                        `}
                     >
                         {opt}
                     </button>
                 ))}
             </div>
             
             {!isEvaluated ? (
                 <button onClick={handleCheck} disabled={!selectedOpt} className="w-full py-3 font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-colors">
                     Check Answer
                 </button>
             ) : (
                 <div className="space-y-4 animate-in slide-in-from-bottom-4">
                     {selectedOpt === q.answer ? (
                         <div className="flex gap-2 items-center font-medium text-emerald-400 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                             <CheckCircle2 className="w-5 h-5"/> Correct! Brilliant job.
                         </div>
                     ) : (
                         <div className="text-red-400 bg-red-500/10 p-4 rounded-lg space-y-3 border border-red-500/20">
                             <div className="flex gap-2 items-center font-medium"><XCircle className="w-5 h-5"/> Incorrect</div>
                             {isThinking ? (
                                 <div className="flex gap-2 items-center text-sm text-red-300 bg-red-500/5 p-3 rounded-md">
                                     <Loader2 className="w-4 h-4 animate-spin"/> AI is analyzing why you went wrong...
                                 </div>
                             ) : (
                                 <p className="text-sm text-red-200 mt-2 p-3 bg-black/20 rounded-md border border-red-500/20 leading-relaxed">{explanation}</p>
                             )}
                         </div>
                     )}
                     <button onClick={() => {
                         if (currentIndex < quizzes.length - 1) {
                             setCurrentIndex(currentIndex + 1); setIsEvaluated(false); setSelectedOpt(null); setExplanation('');
                         } else alert('Quiz complete! Excellent reviewing.')
                     }} className="w-full py-3 bg-white/10 hover:bg-white/20 font-medium text-white rounded-lg transition-colors">
                         Next Question
                     </button>
                 </div>
             )}
        </div>
    )
}
