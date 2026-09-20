import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ResizeHandleProps {
  onResize: (delta: number) => void
}

/**
 * Poignée de redimensionnement verticale entre la sidebar et le contenu principal.
 * Gère les événements souris pour un drag fluide.
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const handleRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastX.current = e.clientX
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    e.preventDefault()
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - lastX.current
      lastX.current = e.clientX
      onResize(delta)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onResize])

  return (
    <div
      ref={handleRef}
      onMouseDown={onMouseDown}
      className="w-1 flex-shrink-0 cursor-col-resize relative group"
      style={{ background: 'transparent' }}
    >
      {/* Ligne de séparation visible au hover */}
      <div className="absolute inset-y-0 left-0 w-px bg-bg-border group-hover:bg-bg-active transition-colors duration-150" />
      {/* Zone de hit élargie invisible */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  )
}
