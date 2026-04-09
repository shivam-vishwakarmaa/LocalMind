import { Folder, MoreVertical } from "lucide-react"

export function FolderGrid() {
  const folders = [
    { title: "Unit 1: Foundations", date: "Updated 2 days ago", items: 4, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
    { title: "Unit 2: Advanced Concepts", date: "Updated 5 hrs ago", items: 12, color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
    { title: "Final Exam Prep", date: "Updated 1 week ago", items: 3, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Your Folders</h2>
        <button className="text-sm text-muted-foreground hover:text-blue-400 transition-colors">See all</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder, idx) => (
          <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-5 hover:bg-black/30 transition-all group flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${folder.color} flex items-center justify-center border border-white/5`}>
                <Folder className={`w-6 h-6 ${folder.iconColor}`} />
              </div>
              <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-auto">
              <h3 className="font-medium text-zinc-100 line-clamp-1">{folder.title}</h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{folder.items} sets</span>
                <span>•</span>
                <span>{folder.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
