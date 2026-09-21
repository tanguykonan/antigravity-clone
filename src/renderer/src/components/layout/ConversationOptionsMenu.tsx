import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Pencil, MessageSquareDot, Trash2 } from 'lucide-react'

interface ConversationOptionsMenuProps {
  isOpen: boolean
  onClose: () => void
  conversationTitle: string
  anchorRef: React.RefObject<HTMLButtonElement | null>
  onDelete?: () => void
  onRename?: () => void
  onMarkUnread?: () => void
}

export const ConversationOptionsMenu: React.FC<ConversationOptionsMenuProps> = ({
  isOpen,
  onClose,
  anchorRef,
  onDelete,
  onRename,
  onMarkUnread
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      let left = rect.right + 6
      let top = rect.top - 4

      // Ajustement pour ne pas déborder de l'écran
      if (left + 175 > window.innerWidth - 10) {
        left = rect.left - 175 - 6
      }
      if (top + 130 > window.innerHeight - 10) {
        top = Math.max(10, window.innerHeight - 140)
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

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] w-[165px] rounded-xl select-none"
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
        {/* Rename */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onRename) onRename()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#dcded9] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px' }}
        >
          <Pencil size={13.5} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Rename</span>
        </button>

        {/* Mark Unread */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onMarkUnread) onMarkUnread()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#dcded9] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px' }}
        >
          <MessageSquareDot size={13.5} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Mark Unread</span>
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-white/[0.08]" />

        {/* Delete */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (onDelete) onDelete()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-[#ff5f56] hover:bg-white/[0.08] hover:text-[#ff6b63] transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px' }}
        >
          <Trash2 size={13.5} className="text-[#ff5f56] group-hover:text-[#ff6b63] flex-shrink-0" />
          <span className="truncate">Delete</span>
        </button>
      </div>
    </div>,
    document.body
  )
}
