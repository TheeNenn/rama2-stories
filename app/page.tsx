'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import MetaversePanel from './components/MetaversePanel'
import GameModal from './components/GameModal'

import type { Pin } from './components/Map'

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
})

// ปีพุทธศักราช → ค.ศ. สำหรับ slider
const MIN_YEAR_CE = 1968  // พ.ศ. 2511
const MAX_YEAR_CE = 2026  // พ.ศ. 2569

export default function Home() {
  const [mode, setMode] = useState<'normal' | 'metaverse'>('normal')
  const [selectedYear, setSelectedYear] = useState(1990)
  const [selectedPlace, setSelectedPlace] = useState('แยกท่าข้าม')
  const [openedPin, setOpenedPin] = useState<Pin | null>(null)

  function handleSelect(pin: Pin) {
    setSelectedPlace(pin.title)
    if (openedPin?.id === pin.id) {
      setOpenedPin(null)
      return
    }
    if (pin.gameId) {
      setOpenedPin(pin)
    }
  }

  function getHighScore(gameId: string) {
    if (typeof window === 'undefined') return 0
    return Number(localStorage.getItem(`highscore-${gameId}`) ?? 0)
  }

  // แสดงปี พ.ศ. บน UI
  const displayYearBE = selectedYear + 543

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-stone-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-800 shadow">
        <h1 className="text-yellow-400 text-xl font-bold">
          🛕 ถนนพระราม 2
        </h1>

      </div>

      {/* Timeline Slider */}
      <div className="px-4 py-2 bg-stone-700 text-white">
        <div className="flex items-center gap-4">
          <span className="text-sm whitespace-nowrap">พ.ศ. {MIN_YEAR_CE + 543}</span>
          <input
            type="range"
            min={MIN_YEAR_CE}
            max={MAX_YEAR_CE}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="flex-1"
          />
          <span className="font-bold text-yellow-400 text-lg whitespace-nowrap min-w-[80px] text-right">
            พ.ศ. {displayYearBE}
          </span>
        </div>

        {/* milestone labels */}
        <div className="flex justify-between text-xs text-stone-400 mt-1 px-0">
          {[2511, 2516, 2532, 2543, 2562, 2565, 2569].map(be => (
            <button
              key={be}
              onClick={() => setSelectedYear(be - 543)}
              className="hover:text-yellow-400 transition"
            >
              {be}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map year={selectedYear} onSelect={handleSelect} />

        {mode === 'metaverse' && (
          <MetaversePanel locationName={selectedPlace} />
        )}
      </div>

      {/* Game Modal */}
      {openedPin && openedPin.gamePath && openedPin.gameId && (
        <GameModal
          title={openedPin.gameTitle ?? openedPin.title}
          gamePath={openedPin.gamePath}
          highScore={getHighScore(openedPin.gameId)}
          onClose={() => setOpenedPin(null)}
        />
      )}
    </main>
  )
}