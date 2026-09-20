import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface TooltipState {
  visible: boolean
  content: string
  shortcut?: string
  x: number
  y: number
  side: 'top' | 'bottom' | 'left' | 'right'
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
    side: 'bottom'
  })

  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-tooltip]') as HTMLElement | null
      if (!target) return

      const content = target.getAttribute('data-tooltip')
      if (!content) return

      const shortcut = target.getAttribute('data-tooltip-shortcut') || undefined
      const side = (target.getAttribute('data-tooltip-side') || 'bottom') as 'top' | 'bottom' | 'left' | 'right'

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
          shortcut,
          x,
          y,
          side
        })
        isWarm = true
      }

      if (isWarm) {
        updatePos()
      } else {
        tooltipTimer = setTimeout(updatePos, 280)
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

  if (typeof document === 'undefined') return null

  // Calcul du style de transformation selon la position
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
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-2xl"
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

        {tooltip.shortcut && (
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#a8aaa4] tracking-normal"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {tooltip.shortcut}
          </kbd>
        )}
      </div>
    </div>,
    document.body
  )
}

interface TooltipProps {
  content: string
  shortcut?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactElement
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  side = 'bottom',
  children
}) => {
  return React.cloneElement(children, {
    'data-tooltip': content,
    ...(shortcut ? { 'data-tooltip-shortcut': shortcut } : {}),
    'data-tooltip-side': side
  })
}
