import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Copy, Settings } from 'lucide-react'

interface ProjectOptionsMenuProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  anchorRef: React.RefObject<HTMLButtonElement | null>
}

export const ProjectOptionsMenu: React.FC<ProjectOptionsMenuProps> = ({
  isOpen,
  onClose,
  projectName,
  anchorRef
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      let left = rect.right + 6
      let top = rect.top - 4

      // Prevent window bounds overflow
      if (left + 185 > window.innerWidth - 10) {
        left = rect.left - 185 - 6
      }
      if (top + 90 > window.innerHeight - 10) {
        top = Math.max(10, window.innerHeight - 100)
      }

      setPos({ top, left })
    } else {
      setPos(null)
    }
  }, [isOpen, anchorRef])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', onClose, true)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', onClose, true)
    }
  }, [isOpen, onClose, anchorRef])

  if (!isOpen || !pos || typeof document === 'undefined') return null

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(projectName)
    onClose()
  }

  const handleOpenSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] w-[175px] rounded-xl select-none"
      style={{
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        backgroundColor: '#222420',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        padding: '4px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={handleCopyName}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
          style={{
            color: '#dcded9',
            fontSize: '12.5px',
            fontWeight: 400
          }}
        >
          <Copy size={13.5} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Copy Project Name</span>
        </button>

        <button
          type="button"
          onClick={handleOpenSettings}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
          style={{
            color: '#dcded9',
            fontSize: '12.5px',
            fontWeight: 400
          }}
        >
          <Settings size={13.5} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Project Settings</span>
        </button>
      </div>
    </div>,
    document.body
  )
}
