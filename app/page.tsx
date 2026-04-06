'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import MetaversePanel from './components/MetaversePanel'

const Map = dynamic(() => import('./components/Map'), { ssr: false })

export default function Home() {
  const [mode, setMode] = useState<'normal' | 'metaverse'>('normal')
  const [selectedPlace, setSelectedPlace] = useState('แยกท่าข้าม')

  return (
    <main className="h-screen flex flex-col bg-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-800 shadow">
        <h1 className="text-yellow-400 text-xl font-bold">🛕 ถนนพระราม 2</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('normal')}
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              mode === 'normal' ? 'bg-yellow-400 text-stone-900' : 'bg-stone-600 text-white hover:bg-stone-500'
            }`}
          >
            🗺️ โหมดธรรมดา
          </button>
          <button
            onClick={() => setMode('metaverse')}
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              mode === 'metaverse' ? 'bg-purple-500 text-white' : 'bg-stone-600 text-white hover:bg-stone-500'
            }`}
          >
            ✨ โหมด Metaverse
          </button>
        </div>
      </div>

      {/* แผนที่ */}
      <div className="flex-1 relative">
        <Map />
        {mode === 'metaverse' && (
          <MetaversePanel locationName={selectedPlace} />
        )}
      </div>
    </main>
  )
}