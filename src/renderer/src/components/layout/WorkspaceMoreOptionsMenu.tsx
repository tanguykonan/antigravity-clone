import React, { useEffect, useRef } from 'react'

interface WorkspaceMoreOptionsMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenTerminal?: () => void
}

export const WorkspaceMoreOptionsMenu: React.FC<WorkspaceMoreOptionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenTerminal
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
      className="absolute right-0 top-full mt-1.5 w-[145px] rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100"
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
            if (onOpenTerminal) onOpenTerminal()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#dcded9] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px', fontWeight: 400 }}
        >
          {/* Icône Square Terminal style exact macOS */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#a0a29c] group-hover:text-white flex-shrink-0"
          >
            <rect width="18" height="18" x="3" y="3" rx="3" />
            <path d="m8 10 2 2-2 2" />
            <path d="M12 14h4" />
          </svg>
          <span className="truncate">Terminal</span>
        </button>
      </div>
    </div>
  )
}
