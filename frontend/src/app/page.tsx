import { HeroSection } from "@/components/dashboard/hero-section"
import { TabsNav } from "@/components/dashboard/tabs-nav"
import { FolderGrid } from "@/components/dashboard/folder-grid"

export default function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <HeroSection />
      
      <div className="space-y-8">
        <TabsNav />
        <FolderGrid />
      </div>
    </div>
  )
}
