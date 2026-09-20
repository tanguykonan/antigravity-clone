import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipState {
  visible: boolean
  content: string
  x: number
  y: number
  side: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

let tooltipTimer: NodeJS.Timeout | null = null
let warmTimer: NodeJS.Timeout | null = null
let isWarm = false

export const TooltipProvider: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
    side: 'bottom',
    align: 'center'
  })

  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-tooltip]') as HTMLElement | null
      if (!target) return

      const content = target.getAttribute('data-tooltip')
      if (!content) return

      const side = (target.getAttribute('data-tooltip-side') || 'bottom') as 'top' | 'bottom' | 'left' | 'right'
      const align = (target.getAttribute('data-tooltip-align') || 'center') as 'start' | 'center' | 'end'

      if (tooltipTimer) clearTimeout(tooltipTimer)
      if (warmTimer) clearTimeout(warmTimer)

      const updatePos = () => {
        const rect = target.getBoundingClientRect()
        let x = rect.left + rect.width / 2
        let y = rect.bottom + 6

        if (side === 'top') {
          y = rect.top - 6
        } else if (side === 'left') {
          x = rect.left - 6
          y = rect.top + rect.height / 2
        } else if (side === 'right') {
          x = rect.right + 6
          y = rect.top + rect.height / 2
        }

        setTooltip({
          visible: true,
          content,
          x,
          y,
          side,
          align
        })
        isWarm = true
      }

      if (isWarm) {
        updatePos()
      } else {
        tooltipTimer = setTimeout(updatePos, 200)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-tooltip]')
      if (!target) return

      if (tooltipTimer) clearTimeout(tooltipTimer)
      setTooltip((prev) => ({ ...prev, visible: false }))

      if (warmTimer) clearTimeout(warmTimer)
      warmTimer = setTimeout(() => {
        isWarm = false
      }, 350)
    }

    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
      if (tooltipTimer) clearTimeout(tooltipTimer)
      if (warmTimer) clearTimeout(warmTimer)
    }
  }, [])

  // Auto-clamp : empêche strictement la bulle de dépasser les bords gauche et droit de l'écran
  useLayoutEffect(() => {
    if (tooltip.visible && tooltipRef.current) {
      const el = tooltipRef.current
      const rect = el.getBoundingClientRect()
      const margin = 14 // marge de sécurité depuis le bord de la fenêtre

      if (rect.right > window.innerWidth - margin) {
        const diff = rect.right - (window.innerWidth - margin)
        el.style.left = `${tooltip.x - diff}px`
      } else if (rect.left < margin) {
        const diff = margin - rect.left
        el.style.left = `${tooltip.x + diff}px`
      }
    }
  }, [tooltip])

  if (typeof document === 'undefined') return null

  let transform = 'translate(-50%, 0)'
  if (tooltip.side === 'top') transform = 'translate(-50%, -100%)'
  else if (tooltip.side === 'left') transform = 'translate(-100%, -50%)'
  else if (tooltip.side === 'right') transform = 'translate(0, -50%)'

  return createPortal(
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] pointer-events-none transition-all duration-150 ease-out select-none ${
        tooltip.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        top: tooltip.y,
        left: tooltip.x,
        transform
      }}
    >
      <div
        className="flex items-center px-2.5 py-1 rounded-lg backdrop-blur-2xl"
        style={{
          backgroundColor: 'rgba(28, 30, 26, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow:
            '0 10px 25px -4px rgba(0, 0, 0, 0.65), 0 3px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif'
        }}
      >
        <span
          className="whitespace-nowrap font-medium text-[#ffffff]"
          style={{ fontSize: '11.5px', letterSpacing: '-0.01em' }}
        >
          {tooltip.content}
        </span>
      </div>
    </div>,
    document.body
  )
}

interface TooltipProps {
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  children: React.ReactElement
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  side = 'bottom',
  align = 'center',
  children
}) => {
  return React.cloneElement(children, {
    'data-tooltip': content,
    'data-tooltip-side': side,
    'data-tooltip-align': align
  })
}
