'use client'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// จุดสำคัญบนถนนพระราม 2
const pins = [
  { id: 1, lat: 13.6511, lng: 100.4675, title: "แยกท่าข้าม", description: "จุดเริ่มต้นถนนพระราม 2 เชื่อมต่อกับถนนพระราม 3" },
  { id: 2, lat: 13.5800, lng: 100.4200, title: "วัดยายร่ม", description: "วัดเก่าแก่ริมถนนพระราม 2 มีประวัติยาวนานกว่า 200 ปี" },
  { id: 3, lat: 13.5200, lng: 100.3800, title: "ตลาดน้ำวัดไทร", description: "ตลาดน้ำโบราณ บรรยากาศย้อนยุค ริมคลองพระราม 2" },
  { id: 4, lat: 13.4500, lng: 100.3200, title: "บางขุนเทียน", description: "ชายหาดบางขุนเทียน ป่าชายเลนผืนสุดท้ายของกรุงเทพฯ" },
]

export default function Map() {
  useEffect(() => {
    // ป้องกัน map ซ้อนทับกัน
    const container = document.getElementById('map') as any
    if (container._leaflet_id) return

    const map = L.map('map').setView([13.58, 100.42], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)

    // icon กำหนดเอง
    const icon = L.divIcon({
      html: '📍',
      className: '',
      iconSize: [30, 30],
    })

    // วางหมุดทุกจุด
    pins.forEach(pin => {
      L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px">
            <b style="font-size:16px">${pin.title}</b>
            <p style="color:#555; margin-top:4px">${pin.description}</p>
          </div>
        `)
    })
  }, [])

  return <div id="map" style={{ width: '100%', height: '100%' }} />
}