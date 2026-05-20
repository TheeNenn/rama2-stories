'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'

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
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [selectedPlace, setSelectedPlace] = useState('แยกท่าข้าม')
  const [openedPin, setOpenedPin] = useState<Pin | null>(null)

  // ✅ zoom state ต้องอยู่ใน component
  const [zoom, setZoom] = useState(10)
  
  function startAutoPlay() {
    setIsPlaying(true)

    intervalRef.current = setInterval(() => {
      setSelectedYear(prev => {
        if (prev >= MAX_YEAR_CE) {
          stopAutoPlay()
          return MIN_YEAR_CE
        }
        return prev + 1
      })
    }, 800)
  }

  function stopAutoPlay() {
    setIsPlaying(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

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

  // แสดงปี พ.ศ.
  const displayYearBE = selectedYear + 543
    useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-black">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-800 shadow">
        <h1 className="text-yellow-400 text-xl font-bold">
          🛕 ถนนพระราม 2
        </h1>
      </div>

      {/* Timeline Slider */}
      <div className="px-2 sm:px-4 py-2 bg-stone-700 text-white">
        <div className="flex items-center gap-4">

          <button
            onClick={isPlaying ? stopAutoPlay : startAutoPlay}
            className="bg-yellow-400 text-black px-3 py-1 rounded"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className="text-sm whitespace-nowrap">
            พ.ศ. {MIN_YEAR_CE + 543}
          </span>

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

        {/* event year buttons — ปีที่มีเหตุการณ์จริง */}
        <div className="flex justify-between mt-1 pb-1">
          {[1968,1970,1971,1973,1979,1987,1989,1994,2000,2003,2019,2022,2023,2024,2025,2026].map(ce => {
            const isActive = selectedYear === ce
            return (
              <button
                key={ce}
                onClick={() => setSelectedYear(ce)}
                className={`
                  text-xs font-bold transition-all
                  ${isActive ? 'text-yellow-400' : 'text-stone-400 hover:text-yellow-400'}
                `}
              >
                {ce + 543}
              </button>
            )
          })}
        </div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 relative overflow-hidden">

        {/* 🔥 Zoom Controls (อยู่ใน Map container แล้ว) */}
        <div className="absolute top-12 right-2 sm:top-14 sm:right-4 flex flex-col gap-2 z-10">
          <button
            onClick={() => setZoom(z => Math.min(z + 1, 18))}
            className="bg-white px-2 py-1 rounded shadow"
          >
            +
          </button>

          <button
            onClick={() => setZoom(z => Math.max(z - 1, 5))}
            className="bg-white px-2 py-1 rounded shadow"
          >
            -
          </button>
        </div>

        {/* Map */}
        <Map
          year={selectedYear}
          zoom={zoom}
          onSelect={handleSelect}
        />

        {/* Metaverse Panel */}
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