'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const INK = '#2B3A2A'
const YELLOW = '#F1E84A'

/**
 * Retro telephone-dial. The ring rotates +angle with spring physics; every node
 * counter-rotates -angle with the SAME spring, so labels stay perfectly upright
 * throughout the spin. The selected node travels to the top pointer.
 * `children` renders the fixed center input card.
 */
export default function DialMachine({ perspectives, activeIndex, onSelect, size = 600, children }) {
  const [angle, setAngle] = useState(0)
  const targetRef = useRef(0)

  const n = perspectives.length
  const step = 360 / n
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const nodeW = size * 0.205
  const nodeH = size * 0.13
  const ringD = radius * 2
  const spring = { type: 'spring', stiffness: 60, damping: 13, mass: 1 }

  useEffect(() => {
    const desired = -activeIndex * step
    const cur = targetRef.current
    const diff = ((desired - cur) % 360 + 540) % 360 - 180 // shortest path
    const next = cur + diff
    targetRef.current = next
    setAngle(next)
  }, [activeIndex, step])

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      {/* Pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ top: size * 0.02 }}>
        <div className="w-0 h-0" style={{ borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `14px solid ${INK}` }} />
      </div>

      {/* Ring line */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: ringD, height: ringD, left: cx - radius, top: cy - radius, border: `1.5px solid ${INK}` }}
      />

      {/* Rotating ring of nodes */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ transformOrigin: '50% 50%' }}
        animate={{ rotate: angle }}
        transition={spring}
      >
        {perspectives.map((p, i) => {
          const ang = ((i * step - 90) * Math.PI) / 180
          const x = cx + radius * Math.cos(ang)
          const y = cy + radius * Math.sin(ang)
          const isActive = i === activeIndex
          return (
            <div key={p.id} className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
              <motion.button
                type="button"
                onClick={() => onSelect(i)}
                animate={{ rotate: -angle }}
                transition={spring}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center font-serif-c cursor-pointer"
                aria-label={p.label}
              >
                <span
                  className="flex items-center justify-center text-center leading-tight"
                  style={{
                    width: nodeW,
                    height: nodeH,
                    borderRadius: '999px',
                    border: `1.5px solid ${INK}`,
                    background: isActive ? INK : YELLOW,
                    color: isActive ? YELLOW : INK,
                    fontSize: Math.max(12, size * 0.026),
                    fontWeight: isActive ? 600 : 500,
                    boxShadow: isActive ? `0 0 0 4px ${YELLOW}, 0 0 0 5.5px ${INK}` : 'none',
                    padding: '0 6px',
                  }}
                >
                  {p.node}
                </span>
              </motion.button>
            </div>
          )
        })}
      </motion.div>

      {/* Center (fixed) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {children}
      </div>
    </div>
  )
}
