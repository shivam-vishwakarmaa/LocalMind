import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/layout/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LocalMind | Study Smarter",
  description: "Your offline, local Cramberry clone.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex bg-background text-foreground`}>
        <Sidebar className="w-64 flex-shrink-0 border-r border-border/50 hidden md:flex" />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
