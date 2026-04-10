"use client"
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Dynamically import to disable SSR. react-force-graph touches Window/Canvas immediately on mount.
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

export function KnowledgeGraph() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:8000/graph")
            .then(res => res.json())
            .then(data => {
                setGraphData(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="h-[500px] w-full flex items-center justify-center border border-white/5 rounded-xl bg-white/5"><Loader2 className="w-8 h-8 animate-spin" /></div>
    }

    return (
        <div className="h-[600px] w-full border border-white/10 rounded-xl overflow-hidden glass-card relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 p-4 xl:p-6 rounded-lg border border-white/10 backdrop-blur pointer-events-none shadow-2xl">
                <h3 className="font-bold text-base mb-3">Neural Visualizer</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-300"><div className="w-3 h-3 rounded-full bg-[#a855f7]" /> Core Vault</div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300"><div className="w-3 h-3 rounded-full bg-[#3b82f6]" /> Folders</div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300"><div className="w-3 h-3 rounded-full bg-[#10b981]" /> Study Sets</div>
                </div>
            </div>
            <ForceGraph2D
                graphData={graphData}
                nodeRelSize={6}
                linkColor={() => 'rgba(255,255,255,0.15)'}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 14/globalScale;
                    ctx.font = `600 ${fontSize}px Inter, Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.beginPath();
                    ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1], 4);
                    ctx.fill();

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color || '#fff';
                    ctx.fillText(label, node.x, node.y);
                    node.__bckgDimensions = bckgDimensions;
                }}
                nodePointerAreaPaint={(node: any, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                }}
                onNodeClick={(node) => {
                    console.log(`Knowledge Graph node routed: ${node.name}`);
                }}
                d3VelocityDecay={0.4}
                height={600}
            />
        </div>
    )
}
