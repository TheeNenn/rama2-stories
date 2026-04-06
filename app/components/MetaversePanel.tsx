'use client'
import { useState } from 'react'

const cardPrompts = [
  "ตำนานผีและสิ่งลึกลับ",
  "วีรบุรุษท้องถิ่น",
  "สงครามและการต่อสู้",
  "ความรักและโศกนาฏกรรม",
  "สัตว์วิเศษและปาฏิหาริย์",
]

interface Props {
  locationName: string
}

export default function MetaversePanel({ locationName }: Props) {
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [mode, setMode] = useState<'card' | 'custom'>('card')

  async function generateStory(promptText: string) {
    setLoading(true)
    setStory('')
    const fullPrompt = `สร้างเรื่องสั้นแนว Metaverse / โลกคู่ขนาน ความยาว 3-4 ประโยค เกี่ยวกับ "${locationName}" บนถนนพระราม 2 โดยมีธีม: ${promptText} เขียนเป็นภาษาไทย`
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    })
    const data = await res.json()
    setStory(data.text)
    setLoading(false)
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#2d1b69',
      color: 'white',
      padding: '16px',
      borderRadius: '16px 16px 0 0',
      maxHeight: '50vh',
      overflowY: 'auto',
      zIndex: 9999
    }}>
      <h2 style={{ color: '#c4b5fd', marginBottom: '12px', fontSize: '18px' }}>
        ✨ โหมด Metaverse — {locationName}
      </h2>

      {/* สลับโหมด */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setMode('card')}
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: mode === 'card' ? '#7c3aed' : '#4c1d95',
            color: 'white'
          }}
        >
          🃏 Card Prompt
        </button>
        <button
          onClick={() => setMode('custom')}
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: mode === 'custom' ? '#7c3aed' : '#4c1d95',
            color: 'white'
          }}
        >
          ✏️ ใส่ Prompt เอง
        </button>
      </div>

      {/* Card Prompt */}
      {mode === 'card' && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {cardPrompts.map(card => (
            <button
              key={card}
              onClick={() => generateStory(card)}
              style={{
                backgroundColor: '#5b21b6',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {card}
            </button>
          ))}
        </div>
      )}

      {/* Custom Prompt */}
      {mode === 'custom' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="อยากเห็นพระราม 2 อย่างไร?"
            style={{
              flex: 1,
              backgroundColor: '#4c1d95',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => generateStory(customPrompt)}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            สร้าง
          </button>
        </div>
      )}

      {loading && <p style={{ color: '#c4b5fd' }}>⏳ กำลังสร้างเรื่องราว...</p>}
      {story && (
        <div style={{
          backgroundColor: '#3b0764',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.8'
        }}>
          {story}
        </div>
      )}
    </div>
  )
}