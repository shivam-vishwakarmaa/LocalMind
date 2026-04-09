"use client"

import { cn } from "@/lib/utils"
import { Search, Plus, Folder, Clock, History, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { SettingsModal } from "./settings-modal"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <div className={cn("flex flex-col h-full bg-card/30 backdrop-blur-sm p-4", className)} {...props}>
        {/* Brand & New Study Set */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-emerald-400"></div>
            LocalMind
          </h1>
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            New Study Set
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-black/20 border border-white/5 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-muted-foreground"
          />
        </div>

        <nav className="flex-1 space-y-6">
          {/* Folders */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Folders</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 text-sm transition-colors text-zinc-300">
                  <Folder className="w-4 h-4 text-blue-400" />
                  Unit 1: Foundations
                </a>
              </li>
            </ul>
          </div>

          {/* Recents */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recents</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 text-sm transition-colors text-zinc-300">
                  <History className="w-4 h-4 text-emerald-400" />
                  Midterm Review
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* User settings simple mock */}
        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"></div>
            <span className="text-sm font-medium">User</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
