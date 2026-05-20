'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const zoomBase = isMobile ? 8 : 10

export type Pin = {
  id: number
  lat: number
  lng: number
  title: string
  description: string
  gameId?: string
  gameTitle?: string
  gamePath?: string
}

// ---- ข้อมูลเหตุการณ์ตามปี ----
type EventPin = {
  id: string
  x: number
  y: number
  year: number
  title: string
  body: string
  icon: string
  type: 'construction' | 'accident' | 'legend' | 'normal'
  imageSrc?: string
  imageCaption?: string
  hasGame?: boolean
  roadSegments?: string[]
}

const events: EventPin[] = [
  {
    id: 'e1',
    year: 1968,
    x:  77.08,
    y: 13.57,
    title: 'ประกาศพระราชกฤษฎีกาเวนคืนที่ดิน',
    body: 'ประกาศพระราชกฤษฎีกาเวนคืนที่ดินเพื่อสร้างทางหลวงสาย "ธนบุรี-ปากท่อ" เพื่อเป็นเส้นทางหลักลงสู่ภาคใต้แทนถนนเพชรเกษม',
    icon: '📜',
    type: 'normal',
  },
  {
    id: 'e2',
    year: 1970,
    x:  77.08,
    y: 13.57,
    title: 'เริ่มก่อสร้างอย่างเป็นทางการ',
    body: 'เริ่มก่อสร้างอย่างเป็นทางการ ท่ามกลางสภาพพื้นที่ที่เป็นดินอ่อนและป่าชายเลน ความท้าทายด้านวิศวกรรมสูงมาก',
    icon: '🏗️',
    type: 'construction',
  },
  {
    id: 'e3',
    year: 1971,
    x:  77.08,
    y: 13.57,
    title: 'ตำนานเจ้าแม่งูจงอาง',
    body: 'ตำนานเจ้าแม่งูจงอางเกิดขึ้นในช่วงนี้ เมื่อคนงานฝันเห็นงูมาขอเวลา แต่มีการขับรถทับครอบครัวงู จนเกิดเป็นเรื่องเล่าอาถรรพ์ที่ทำให้ถนนสร้างลำบาก',
    icon: '🐍',
    type: 'legend',
  },
  {
    id: 'e4',
    year: 1973,
    x:  77.08,
    y: 13.57,
    title: 'เปิดใช้งานครั้งแรก (1 เม.ย. 2516)',
    body: 'เปิดเป็นถนน 2 เลนสวนกัน ไม่มีเกาะกลาง ชาวบ้านเริ่มเดินทางลงใต้สะดวกขึ้น',
    icon: '🛣️',
    type: 'accident',
    imageCaption: 'ถนนพระราม 2 สายแรก ปี 2516 — 2 เลน ไม่มีเกาะกลาง',
    hasGame: true,
  },
  {
    id: 'e5',
    year: 1979,
    x:  77.08,
    y: 13.57,
    title: 'ปัญหาถนนทรุดครั้งแรก',
    body: 'เริ่มพบปัญหาถนนทรุดจากดินเหนียวอ่อน (Soft Bangkok Clay) ต้องซ่อมบำรุงบ่อยครั้ง',
    icon: '⚠️',
    type: 'accident',
  },
  {
    id: 'e5b',
    year: 1987,
    x:  77.08,
    y: 13.57,
    title: 'ขยายถนนเป็น 4 เลน + เกาะกลาง',
    body: 'เริ่มโครงการขยายถนนจาก 2 เลน เป็น 4 เลน และเพิ่มเกาะกลางถนนเป็นครั้งแรก เพื่อรองรับปริมาณรถที่เพิ่มขึ้น',
    icon: '🔧',
    type: 'construction',
  },
  {
    id: 'e6',
    year: 1989,
    x: 59.01,
    y: 33.39,
    title: 'โครงการขยาย 10–14 เลน',
    body: 'รัฐบาลอนุมัติโครงการขยายถนนครั้งใหญ่ที่สุดเพื่อรองรับการขยายตัวของเมืองและนิคมอุตสาหกรรม',
    icon: '🔧',
    type: 'construction',
    // imageSrc: '/assets/2532.png',
    // imageCaption: 'โครงการขยาย ปี 2532',
    // hasGame: true,
  },
  {
    id: 'e7',
    year: 1994,
    x: 59.01,
    y: 33.39,
    title: '"ถนนเจ็ดชั่วโคตร"',
    body: 'ช่วง 2535–2539 จราจรติดขัดรุนแรงที่สุด สื่อและประชาชนขนานนาม "ถนนเจ็ดชั่วโคตร" เพราะสร้างไม่เสร็จสักที',
    icon: '😤',
    type: 'accident',
    // imageSrc: '/assets/2539.png',
    // imageCaption: 'ถนนพระราม 2 ปี 2539 — ยุคถนนเจ็ดชั่วโคตร',
    // hasGame: true,
  },
  {
    id: 'e8',
    year: 2000,
    x: 69.91,
    y: 20.05,
    title: 'ทางแยกต่างระดับบางขุนเทียนเสร็จ',
    body: 'เชื่อมต่อกับถนนกาญจนาภิเษก (วงแหวนรอบนอก) ช่วยบรรเทาการจราจรได้บ้าง',
    icon: '🔧',
    type: 'construction',
  },
  {
    id: 'e8b',
    year: 2003,
    x: 53.46,
    y: 42.26,
    title: 'ปรับระดับถนนหนีน้ำท่วม',
    body: 'เริ่มมีการปรับระดับถนนให้สูงขึ้นเพื่อหนีปัญหาน้ำท่วมขังในช่วงน้ำทะเลหนุน ซึ่งส่งผลกระทบต่อการสัญจรในฤดูน้ำหลากทุกปี',
    icon: '🌊',
    type: 'construction',
  },
  {
    id: 'e9',
    year: 2019,
    x: 68.96,
    y: 22.05,
    title: 'เริ่มก่อสร้างมอเตอร์เวย์ M82',
    body: 'ก่อสร้างทางยกระดับบางขุนเทียน–บ้านแพ้ว บนเกาะกลางถนนท่ามกลางรถที่วิ่งอยู่ข้างล่าง',
    icon: '🔧',
    type: 'construction',
    // imageSrc: '/assets/2561.png',
    // imageCaption: 'ก่อสร้าง M82 ปี 2562',
    // hasGame: true,
  },
  {
    id: 'e10',
    year: 2022,
    x: 55.69,
    y: 40.26,
    title: 'คานสะพานถล่ม (31 ก.ค. 2565)',
    body: 'คานสะพานกลับรถถล่มที่ กม.34 หน้า รพ.วิภาราม ทับรถยนต์ เสียชีวิต 2 ราย เป็นข่าวดังระดับโลก',
    icon: '❗',
    type: 'accident',
    imageSrc: '/assets/2565.jpg',
    imageCaption: 'เหตุคานถล่ม ก.ค. 2565',
    hasGame: true,
  },
  {
    id: 'e11',
    year: 2023,
    x: 77.68,
    y: 14.09,
    title: 'คานเหล็ก Launcher ร่วง (7 พ.ค. 2566)',
    body: 'คานเหล็กสำหรับยกแผ่นปูนร่วงหน้า Index Living Mall ทับรถยนต์เสียหายและมีคนงานเสียชีวิต',
    icon: '❗',
    type: 'accident',
    imageSrc: '/assets/2566.png',
    imageCaption: 'เหตุ Launcher ร่วง พ.ค. 2566',
    hasGame: true,
  },
  {
    id: 'e12',
    year: 2024,
    x: 61.82,
    y: 28.66,
    title: 'ตัวยกถล่มในสมุทรสาคร (29 พ.ย. 2567)',
    body: 'เกิดเหตุตัวยกแผ่นปูนถล่มในเขตสมุทรสาคร คนงานเสียชีวิตรวดเดียว 3 ราย มีคำสั่งหยุดก่อสร้างชั่วคราว',
    icon: '❗',
    type: 'accident',
    imageSrc: '/assets/2567.jpg',
    imageCaption: 'เหตุถล่มสมุทรสาคร พ.ย. 2567',
    hasGame: true,
  },
  {
    id: 'e13',
    year: 2025,
    x: 55.69,
    y: 40.26,
    title: 'เครนถล่มปิดถนน (14 ม.ค. 2568)',
    body: 'เครนถล่มปิดกั้นทุกช่องทางใน กม.28 รถติดสะสมยาวหลายสิบกิโลเมตรนานกว่า 5 ชั่วโมง',
    icon: '❗',
    type: 'accident',
    imageSrc: '/assets/2568.png',
    imageCaption: 'เครนถล่ม ม.ค. 2568',
    hasGame: true,
  },
  {
    id: 'e14',
    year: 2026,
    x: 55.69,
    y: 40.26,
    title: 'รถบรรทุกเกี่ยวสะพานลอย (2 เม.ย. 2569)',
    body: 'รถบรรทุกเกี่ยวสะพานลอยจนโครงสร้างทรุดและป้ายโฆษณาร่วงลงขวางถนนในช่วงเช้ามืด',
    icon: '❗',
    type: 'accident',
    imageSrc: '/assets/2569.jpg',
    imageCaption: 'เหตุสะพานลอยทรุด เม.ย. 2569',
    hasGame: true,
  },
]

// colour map per type
const typeColor: Record<EventPin['type'], string> = {
  construction: '#f59e0b',
  accident:     '#ef4444',
  legend:       '#a855f7',
  normal:       '#22d3ee',
}

const typeBg: Record<EventPin['type'], string> = {
  construction: '#451a03',
  accident:     '#450a0a',
  legend:       '#3b0764',
  normal:       '#083344',
}

// ---- Geographic bounds ของรูปภาพ (ปรับให้ตรงกับ lat/lng จริงของถนนพระราม 2) ----
// รูปภาพครอบคลุมพื้นที่ตั้งแต่ Bangkok ลงมาทาง south-west
// const MAP_BOUNDS = {
//   north: 13.75,   // lat สูงสุด (บน)
//   south: 13.40,   // lat ต่ำสุด (ล่าง)
//   west:  100.28,  // lng ซ้ายสุด (ซ้าย)
//   east:  100.52,  // lng ขวาสุด (ขวา)
// }

// // แปลง lat/lng → เปอร์เซ็นต์บนรูปภาพ
// function latLngToPercent(lat: number, lng: number) {
//   const x = ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100
//   const y = ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100
//   return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) }
// }

// รูปภาพตามช่วงปี (พ.ค.ศ.)
function getBackgroundImage(year: number): string | null {
  // ปรับ path ให้ตรงกับไฟล์จริงในโปรเจค
  if (year >= 1968 && year <= 1972) return '/assets/2511-2515.png'
  if (year >= 1973 && year <= 1988) return '/assets/2516-2531.png'
  if (year >= 1989 && year <= 1995) return '/assets/2532-2538.png'
  if (year >= 1996 && year <= 2017) return '/assets/2539-2560.png'
  if (year >= 2018 && year <= 2026) return '/assets/2561-2569.png'
  // ปีอื่น ๆ ยังไม่มีรูป → คืน null (ใช้พื้นหลังสีเข้ม)
  return null
}

// ---- Component ----
interface Props {
  year: number
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  onSelect: (pin: Pin) => void
}

export default function Map({ year, zoom, setZoom, onSelect }: Props) {
  const [modalEvent, setModalEvent] = useState<EventPin | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const mapRef = useRef<any>(null)

  // Pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const offsetAtDragStart = useRef({ x: 0, y: 0 })
  const scale = zoom / zoomBase

  const MIN_ZOOM = 5
  const MAX_ZOOM = 40

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      if (e.deltaY < 0) {
        // หมุนขึ้น = ซูมเข้า
        setZoom(z => Math.min(z + 1, MAX_ZOOM))
      } else {
        // หมุนลง = ซูมออก
        setZoom(z => Math.max(z - 1, MIN_ZOOM))
      }
    },
    [setZoom]
  )

  // Reset offset when zoom returns to base
  useEffect(() => {
    if (zoom === zoomBase) setOffset({ x: 0, y: 0 })
  }, [zoom])

  useEffect(() => {
    if (!modalEvent) setIsFullscreen(false)
  }, [modalEvent])

  // Mouse drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return
    isDragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetAtDragStart.current = offset
    e.preventDefault()
  }, [scale, offset])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setOffset({ x: offsetAtDragStart.current.x + dx, y: offsetAtDragStart.current.y + dy })
  }, [])

  const onMouseUp = useCallback(() => { isDragging.current = false }, [])

  // Touch drag handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale <= 1) return
    const t = e.touches[0]
    isDragging.current = true
    dragStart.current = { x: t.clientX, y: t.clientY }
    offsetAtDragStart.current = offset
  }, [scale, offset])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragStart.current.x
    const dy = t.clientY - dragStart.current.y
    setOffset({ x: offsetAtDragStart.current.x + dx, y: offsetAtDragStart.current.y + dy })
  }, [])

  const onTouchEnd = useCallback(() => { isDragging.current = false }, [])

  const bgImage = getBackgroundImage(year)
  const visible = events.filter(
    e => e.year === year
  )

  return (
    <>
      {/* ---- Pan+Zoom Wrapper ---- */}
      <div
        onWheel={onWheel}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          cursor: scale > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
      {/* ---- Map Canvas ---- */}
      <div
        onClick={(e) => {
          if (isDragging.current) return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          console.log(`x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`)
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: '#290f28',
          touchAction: 'none',
          transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
          transformOrigin: 'center',
          transition: isDragging.current ? 'none' : 'transform 0.2s ease',
        }}
      >
        {/* Background image */}
        {bgImage ? (
          <img
            key={bgImage}
            src={bgImage}
            alt="แผนที่ถนนพระราม 2"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        ) : (
          /* ไม่มีรูป: ใช้พื้นหลัง gradient เข้ม */
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 60% 40%, #3d1a3c 0%, #290f28 100%)',
          }} />
        )}

        {/* Dim overlay เพื่อให้ marker อ่านง่าย */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          pointerEvents: 'none',
        }} />

        {/* ---- Markers ---- */}
        {visible.map(ev => {
          // const { x, y } = latLngToPercent(ev.lat, ev.lng)
          
          const color = typeColor[ev.type]

          const iconFile = {
            accident:     '/assets/accident.png',
            construction: '/assets/instruct.png',
            legend:       '/assets/shrine.png',
            normal:       '/assets/shrine.png',
          }[ev.type]

          return (
            <div
              key={ev.id}
              onClick={() => setModalEvent(ev)}
              style={{
                position: 'absolute',
                left: `${ev.x}%`,
                top: `${ev.y}%`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))',
                zIndex: 10,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1)')}
            >
              <img
                src={iconFile}
                alt={ev.type}
                style={{ width: 44, height: 44, objectFit: 'contain', display: 'block' }}
              />
              <div style={{
                background: 'rgba(28,25,23,0.9)',
                color,
                fontSize: 9,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 4,
                border: `1px solid ${color}66`,
                whiteSpace: 'nowrap',
                fontFamily: "'Sarabun', sans-serif",
                marginTop: 2,
              }}>
                {ev.year + 543}
              </div>
              {/* Stem dot */}
              <div style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: color,
                marginTop: 1,
                boxShadow: `0 0 6px ${color}`,
              }} />
            </div>
          )
        })}

        {/* No-image label */}
        {!bgImage && (
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#57534e',
            fontSize: 11,
            fontFamily: "'Sarabun', sans-serif",
            letterSpacing: 1,
            pointerEvents: 'none',
          }}>
            ยังไม่มีภาพแผนที่สำหรับปีนี้
          </div>
        )}

        {/* Year badge overlay */}
        <div style={{
          position: 'absolute',
          top: 12,
          right: 14,
          background: 'rgba(28,25,23,0.85)',
          border: '1px solid #78716c44',
          borderRadius: 8,
          padding: '4px 12px',
          color: '#fbbf24',
          fontFamily: "'Sarabun', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          backdropFilter: 'blur(6px)',
          pointerEvents: 'none',
        }}>
          พ.ศ. {year + 543}
        </div>
      </div>
      </div>{/* end pan+zoom wrapper */}

      {/* ---- Event Modal ---- */}
      {modalEvent && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isFullscreen ? typeBg[modalEvent.type] : 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: isFullscreen ? 'stretch' : 'center',
            justifyContent: isFullscreen ? 'stretch' : 'center',
            zIndex: 9999,
            backdropFilter: isFullscreen ? 'none' : 'blur(4px)',
            transition: 'background 0.3s',
          }}
          onClick={() => { if (!isFullscreen) setModalEvent(null) }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: typeBg[modalEvent.type],
              border: isFullscreen ? 'none' : `1.5px solid ${typeColor[modalEvent.type]}55`,
              borderRadius: isFullscreen ? '0' : '16px',
              width: isFullscreen ? '100%' : 'min(480px, 92vw)',
              height: isFullscreen ? '100%' : 'auto',
              overflow: isFullscreen ? 'auto' : 'hidden',
              boxShadow: isFullscreen ? 'none' : `0 0 40px ${typeColor[modalEvent.type]}44`,
              fontFamily: "'Sarabun', sans-serif",
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-radius 0.3s, width 0.3s',
            }}
          >
            {/* Header bar */}
            <div style={{
              background: typeColor[modalEvent.type],
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#1c1917', letterSpacing: 1 }}>
                {modalEvent.icon} พ.ศ. {modalEvent.year + 543}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setIsFullscreen(f => !f)}
                  title={isFullscreen ? 'ย่อลง' : 'เต็มจอ'}
                  style={{
                    background: 'rgba(0,0,0,0.15)',
                    border: 'none',
                    borderRadius: 6,
                    width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#1c1917',
                  }}
                >
                  {isFullscreen ? '⊡' : '⛶'}
                </button>
                <button
                  onClick={() => setModalEvent(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 18,
                    cursor: 'pointer',
                    color: '#1c1917',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {modalEvent.roadSegments ? (
              <>
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#000',
                  position: 'relative',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollSnapType: 'x mandatory',
                  display: 'flex',
                }}>
                  {modalEvent.roadSegments.map((src, i) => (
                    <div key={i} style={{
                      flexShrink: 0,
                      width: '100%',
                      height: '100%',
                      scrollSnapAlign: 'start',
                      position: 'relative',
                    }}>
                      <img
                        src={src}
                        alt={`road segment ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute', bottom: 28, left: '50%',
                        transform: 'translateX(-50%)', display: 'flex', gap: 6,
                      }}>
                        {modalEvent.roadSegments!.map((_, j) => (
                          <div key={j} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i === j ? '#fff' : 'rgba(255,255,255,0.35)',
                          }} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {modalEvent.imageCaption && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '20px 12px 6px',
                      color: '#a8a29e', fontSize: 10, letterSpacing: 0.5, zIndex: 10,
                    }}>
                      {modalEvent.imageCaption}
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <h2 style={{ color: typeColor[modalEvent.type], fontSize: 18, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.4 }}>
                    {modalEvent.title}
                  </h2>
                  <p style={{ color: '#d6d3d1', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {modalEvent.body}
                  </p>
                </div>
              </>
            ) : modalEvent.imageSrc ? (
              <>
                <div style={{
                  width: '100%',
                  height: isFullscreen ? '70%' : 200,
                  background: '#290f28',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img
                    src={modalEvent.imageSrc}
                    alt={modalEvent.imageCaption}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.95 }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  {modalEvent.imageCaption && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      padding: '24px 12px 8px', color: '#d6d3d1', fontSize: 11,
                    }}>
                      {modalEvent.imageCaption}
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <h2 style={{ color: typeColor[modalEvent.type], fontSize: 18, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.4 }}>
                    {modalEvent.title}
                  </h2>
                  <p style={{ color: '#d6d3d1', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {modalEvent.body}
                  </p>
                  <div style={{ marginTop: 14 }}>
                    <span style={{
                      background: typeColor[modalEvent.type] + '22',
                      border: `1px solid ${typeColor[modalEvent.type]}44`,
                      color: typeColor[modalEvent.type],
                      borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                    }}>
                      {{ construction: '🔧 การก่อสร้าง', accident: '❗ อุบัติเหตุ', legend: '🐍 ตำนาน', normal: '📌 เหตุการณ์' }[modalEvent.type]}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '28px 24px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: typeColor[modalEvent.type] + '22',
                    border: `2px solid ${typeColor[modalEvent.type]}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30, flexShrink: 0,
                    boxShadow: `0 0 20px ${typeColor[modalEvent.type]}33`,
                  }}>
                    {modalEvent.icon}
                  </div>
                  <div>
                    <div style={{ color: typeColor[modalEvent.type], fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
                      {{ construction: '🔧 การก่อสร้าง', accident: '❗ อุบัติเหตุ', legend: '🐍 ตำนาน', normal: '📌 เหตุการณ์' }[modalEvent.type]}
                    </div>
                    <h2 style={{ color: '#f5f5f4', fontSize: 17, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
                      {modalEvent.title}
                    </h2>
                  </div>
                </div>
                <div style={{
                  height: 1,
                  background: `linear-gradient(to right, ${typeColor[modalEvent.type]}44, transparent)`,
                  marginBottom: 18,
                }} />
                <p style={{
                  color: '#e7e5e4',
                  fontSize: 15,
                  lineHeight: 1.85,
                  margin: 0,
                  fontFamily: "'Sarabun', sans-serif",
                }}>
                  {modalEvent.body}
                </p>
              </div>
            )}

            {/* ปุ่มเล่นเกม */}
            {modalEvent.hasGame && (
              <div style={{ padding: '0 20px 20px', flexShrink: 0 }}>
                <button
                  onClick={() => window.open('/game/Rama2_Game/index.html', '_blank')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontFamily: "'Sarabun', sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: 1,
                    boxShadow: '0 0 20px #a855f744',
                  }}
                >
                  🎮 เล่นเกมพระราม 2
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}