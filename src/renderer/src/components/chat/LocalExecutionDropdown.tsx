import React, { useEffect, useRef } from 'react'

interface LocalExecutionDropdownProps {
  isOpen: boolean
  onClose: () => void
  selectedOption?: string
  onSelectOption?: (option: string) => void
  onNewWorktree?: () => void
}

export const LocalExecutionDropdown: React.FC<LocalExecutionDropdownProps> = ({
  isOpen,
  onClose,
  selectedOption = 'Local',
  onSelectOption,
  onNewWorktree
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
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1.5 w-[165px] rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
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
        {/* Option 1 : Local */}
        <button
          type="button"
          onClick={() => {
            onSelectOption?.('Local')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
          style={{
            color: selectedOption === 'Local' ? '#ffffff' : '#dcded9',
            fontSize: '12.5px',
            backgroundColor: selectedOption === 'Local' ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
          }}
        >
          <svg
            width="13.5"
            height="13.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0"
          >
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
          <span className="truncate font-normal">Local</span>
        </button>

        {/* Option 2 : New Worktree */}
        <button
          type="button"
          onClick={() => {
            onNewWorktree?.()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
          style={{
            color: '#dcded9',
            fontSize: '12.5px'
          }}
        >
          {/* Icône Branching Worktree vectorielle */}
          <svg
            width="13.5"
            height="13.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0"
          >
            <line x1="12" y1="21" x2="12" y2="13" />
            <path d="M12 13L7 8" />
            <polyline points="10 8 7 8 7 11" />
            <path d="M12 13L17 8" />
            <polyline points="14 8 17 8 17 11" />
          </svg>
          <span className="truncate font-normal">New Worktree</span>
        </button>
      </div>
    </div>
  )
}
