'use client'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const pinsByYear: Record<number, Pin[]> = {
  1990: [
    {
      id: 1,
      lat: 13.6511,
      lng: 100.4675,
      title: 'แยกท่าข้าม',
      description: 'พระราม 2 ยุคเริ่มต้น',
    },
  ],

  2000: [
    {
      id: 1,
      lat: 13.6511,
      lng: 100.4675,
      title: 'แยกท่าข้าม',
      description: 'เริ่มขยายเมือง',
      gameId: 'takham-game',
      gameTitle: 'เกมแยกท่าข้าม',
      gamePath: '/game/Rama2_Game/index.html',
    },

    {
      id: 2,
      lat: 13.58,
      lng: 100.42,
      title: 'วัดยายร่ม',
      description: 'ชุมชนเริ่มหนาแน่น',
    },
  ],

  2020: [
    {
      id: 1,
      lat: 13.6511,
      lng: 100.4675,
      title: 'แยกท่าข้าม',
      description: 'พื้นที่เมืองปัจจุบัน',
      gameId: 'takham-game',
      gameTitle: 'เกมแยกท่าข้าม',
      gamePath: '/game/Rama2_Game/index.html',
    },

    {
      id: 2,
      lat: 13.45,
      lng: 100.32,
      title: 'บางขุนเทียน',
      description: 'จุดท่องเที่ยวสำคัญ',
      gameId: 'bangkhuntian-game',
      gameTitle: 'เกมบางขุนเทียน',
      gamePath: '/game/Rama2_Game/index.html',
    },
  ],
}

interface Props {
  year: number
  onSelect: (pin: Pin) => void
}

export default function Map({ year, onSelect }: Props) {
  const pins = pinsByYear[year] ?? []

  useEffect(() => {
    const mapElement = document.getElementById('map')

    if (!mapElement) return

    const map = L.map(mapElement).setView([13.58, 100.42], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map)

    pins.forEach((pin) => {
      const icon = L.divIcon({
        html: pin.gameId ? '🎮' : '📍',
        className: '',
        iconSize: [30, 30],
      })

      L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px">
            <b>${pin.title}</b>
            <p>${pin.description}</p>
          </div>
        `)
        .on('click', () => {
          if (pin.gameId) {
            onSelect(pin)
          }
        })
    })

    return () => {
      map.remove()
    }
  }, [year])

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}