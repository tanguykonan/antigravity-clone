import React, { useEffect, useRef } from 'react'
import { Play, Trash2 } from 'lucide-react'

interface ScheduledTaskOptionsMenuProps {
  isOpen: boolean
  onClose: () => void
  onRunNow?: () => void
  onDelete?: () => void
}

export const ScheduledTaskOptionsMenu: React.FC<ScheduledTaskOptionsMenuProps> = ({
  isOpen,
  onClose,
  onRunNow,
  onDelete
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-[145px] rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100"
      style={{
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
          onClick={() => {
            if (onRunNow) onRunNow()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#dcded9] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px', fontWeight: 400 }}
        >
          <Play size={13} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Run Now</span>
        </button>

        <div className="my-1 border-t border-white/[0.08]" />

        <button
          type="button"
          onClick={() => {
            if (onDelete) onDelete()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#ff5f56] hover:bg-white/[0.08] hover:text-[#ff6b63] transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px', fontWeight: 400 }}
        >
          <Trash2 size={13} className="text-[#ff5f56] group-hover:text-[#ff6b63] flex-shrink-0" />
          <span className="truncate">Delete</span>
        </button>
      </div>
    </div>
  )
}
