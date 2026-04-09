"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const tabs = ["Notes", "Flashcards", "Quiz", "Short Answer", "Key Terms", "Podcast"]

export function TabsNav() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="border-b border-border/50">
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
    </div>
  )
}
