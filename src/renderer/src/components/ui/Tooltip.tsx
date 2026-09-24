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

  // ready = false until useLayoutEffect has adjusted position
  const [ready, setReady] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let activeTarget: HTMLElement | null = null

    const hide = () => {
      if (tooltipTimer) {
        clearTimeout(tooltipTimer)
        tooltipTimer = null
      }
      activeTarget = null
      setReady(false)
      setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev))

      if (warmTimer) clearTimeout(warmTimer)
      warmTimer = setTimeout(() => {
        isWarm = false
      }, 300)
    }

    const handlePointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-tooltip]') as HTMLElement | null

      // If cursor is no longer over an element with a tooltip
      if (!target) {
        if (activeTarget) {
          hide()
        }
        return
      }

      // If cursor is still over the same element
      if (target === activeTarget) {
        return
      }

      // Target changed
      activeTarget = target
      const content = target.getAttribute('data-tooltip')
      if (!content) {
        hide()
        return
      }

      const side = (target.getAttribute('data-tooltip-side') || 'bottom') as 'top' | 'bottom' | 'left' | 'right'
      const align = (target.getAttribute('data-tooltip-align') || 'center') as 'start' | 'center' | 'end'

      if (tooltipTimer) clearTimeout(tooltipTimer)
      if (warmTimer) clearTimeout(warmTimer)

      const updatePos = () => {
        if (activeTarget !== target) return
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

        setReady(false)
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
        tooltipTimer = setTimeout(updatePos, 150)
      }
    }

    const handleWindowLeave = () => {
      hide()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', hide)
    window.addEventListener('wheel', hide, { passive: true })
    window.addEventListener('scroll', hide, { passive: true })
    window.addEventListener('blur', hide)
    document.addEventListener('mouseleave', handleWindowLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('wheel', hide)
      window.removeEventListener('scroll', hide)
      window.removeEventListener('blur', hide)
      document.removeEventListener('mouseleave', handleWindowLeave)
      if (tooltipTimer) clearTimeout(tooltipTimer)
      if (warmTimer) clearTimeout(warmTimer)
    }
  }, [])

  // Auto-clamp: adjusts position before rendering to avoid viewport overflow
  useLayoutEffect(() => {
    if (tooltip.visible && tooltipRef.current) {
      const el = tooltipRef.current
      el.style.left = `${tooltip.x}px`

      const rect = el.getBoundingClientRect()
      const margin = 14

      if (rect.right > window.innerWidth - margin) {
        const diff = rect.right - (window.innerWidth - margin)
        el.style.left = `${tooltip.x - diff}px`
      } else if (rect.left < margin) {
        const diff = margin - rect.left
        el.style.left = `${tooltip.x + diff}px`
      }

      setReady(true)
    }
  }, [tooltip])

  if (typeof document === 'undefined') return null

  let transform = 'translate(-50%, 0)'
  if (tooltip.side === 'top') transform = 'translate(-50%, -100%)'
  else if (tooltip.side === 'left') transform = 'translate(-100%, -50%)'
  else if (tooltip.side === 'right') transform = 'translate(0, -50%)'

  const isVisible = tooltip.visible && ready

  return createPortal(
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] pointer-events-none select-none transition-opacity duration-100 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
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
