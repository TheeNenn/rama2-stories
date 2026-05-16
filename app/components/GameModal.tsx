'use client'

interface Props {
  title: string
  gamePath: string
  highScore: number
  onClose: () => void
}

export default function GameModal({
  title,
  gamePath,
  highScore,
  onClose,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '85%',
          height: '85%',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #ddd',
          }}
        >
          <div>
            <strong>{title}</strong>

            <div style={{ fontSize: '12px' }}>
              High Score: {highScore}
            </div>
          </div>

          <button onClick={onClose}>ปิด</button>
        </div>

        <iframe
          src={gamePath}
          style={{
            width: '100%',
            height: 'calc(100% - 52px)',
            border: 'none',
          }}
        />
      </div>
    </div>
  )
}