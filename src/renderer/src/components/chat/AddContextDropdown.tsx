import React, { useEffect, useRef } from 'react'
import { Image, AtSign } from 'lucide-react'

interface AddContextDropdownProps {
  isOpen: boolean
  onClose: () => void
  onSelectAction?: (action: string) => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

export const AddContextDropdown: React.FC<AddContextDropdownProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  anchorRef
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target as Node))
      ) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }, 10)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, anchorRef])

  if (!isOpen) return null

  const items = [
    {
      id: 'media',
      label: 'Media',
      icon: <Image size={15} strokeWidth={1.8} className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0" />
    },
    {
      id: 'mentions',
      label: 'Mentions',
      icon: <AtSign size={15} strokeWidth={1.8} className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0" />
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0"
        >
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <line x1="8" y1="17" x2="16" y2="7" />
        </svg>
      )
    },
    {
      id: 'browser',
      label: 'Browser',
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="21.17" y1="8" x2="12" y2="8" />
          <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
          <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
        </svg>
      )
    }
  ]

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-2 w-[165px] rounded-2xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
      style={{
        backgroundColor: '#222420',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        padding: '6px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Titre Add Context */}
      <div className="px-2.5 pt-1 pb-1.5">
        <span
          style={{
            fontSize: '12px',
            color: '#8a8c87',
            fontWeight: 500
          }}
        >
          Add Context
        </span>
      </div>

      {/* Liste des options */}
      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelectAction?.(item.id)
              onClose()
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
            style={{
              color: '#dcded9',
              fontSize: '13px',
              fontWeight: 400
            }}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
