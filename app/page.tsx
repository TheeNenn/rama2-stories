'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import MetaversePanel from './components/MetaversePanel'
import GameModal from './components/GameModal'

import type { Pin } from './components/Map'

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
})

export default function Home() {
  const [mode, setMode] = useState<'normal' | 'metaverse'>(
    'normal'
  )

  const [selectedYear, setSelectedYear] =
    useState(2020)

  const [selectedPlace, setSelectedPlace] =
    useState('แยกท่าข้าม')

  const [openedPin, setOpenedPin] =
    useState<Pin | null>(null)

  // กดหมุด
  function handleSelect(pin: Pin) {
    setSelectedPlace(pin.title)

    // ถ้ากดหมุดเดิม -> ปิดเกม
    if (openedPin?.id === pin.id) {
      setOpenedPin(null)
      return
    }

    // ถ้ามีเกม -> เปิด modal
    if (pin.gameId) {
      setOpenedPin(pin)
    }
  }

  // โหลด High Score
  function getHighScore(gameId: string) {
    if (typeof window === 'undefined') return 0

    return Number(
      localStorage.getItem(
        `highscore-${gameId}`
      ) ?? 0
    )
  }

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-800 shadow">
        <h1 className="text-yellow-400 text-xl font-bold">
          🛕 ถนนพระราม 2
        </h1>

        {/* Mode */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('normal')}
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              mode === 'normal'
                ? 'bg-yellow-400 text-stone-900'
                : 'bg-stone-600 text-white'
            }`}
          >
            🗺️ โหมดธรรมดา
          </button>

          <button
            onClick={() =>
              setMode('metaverse')
            }
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              mode === 'metaverse'
                ? 'bg-purple-500 text-white'
                : 'bg-stone-600 text-white'
            }`}
          >
            ✨ Metaverse
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-2 bg-stone-700 text-white">
        <div className="flex items-center gap-4">
          <span>ปี</span>

          <input
            type="range"
            min={1990}
            max={2026}
            step={2}
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                Number(e.target.value)
              )
            }
            className="flex-1"
          />

          <span className="font-bold text-yellow-400">
            {selectedYear}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map
          year={selectedYear}
          onSelect={handleSelect}
        />

        {/* Metaverse Panel */}
        {mode === 'metaverse' && (
          <MetaversePanel
            locationName={selectedPlace}
          />
        )}
      </div>

      {/* Game Modal */}
      {openedPin &&
        openedPin.gamePath &&
        openedPin.gameId && (
          <GameModal
            title={
              openedPin.gameTitle ??
              openedPin.title
            }
            gamePath={openedPin.gamePath}
            highScore={getHighScore(
              openedPin.gameId
            )}
            onClose={() =>
              setOpenedPin(null)
            }
          />
        )}
    </main>
  )
}