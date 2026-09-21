import React, { useEffect, useRef } from 'react'
import { GitBranch, Check } from 'lucide-react'

interface BranchSelectorDropdownProps {
  isOpen: boolean
  onClose: () => void
  selectedBranch?: string
  onSelectBranch?: (branch: string) => void
  branches?: string[]
}

export const BranchSelectorDropdown: React.FC<BranchSelectorDropdownProps> = ({
  isOpen,
  onClose,
  selectedBranch = 'main',
  onSelectBranch,
  branches = ['main', 'master']
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
      className="absolute top-full left-0 mt-1.5 w-[140px] rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
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
        {branches.map((branch) => {
          const isSelected = branch === selectedBranch
          return (
            <button
              key={branch}
              type="button"
              onClick={() => {
                onSelectBranch?.(branch)
                onClose()
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group hover:bg-white/[0.08]"
              style={{
                color: isSelected ? '#ffffff' : '#dcded9',
                fontSize: '12.5px',
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <GitBranch size={13} className="text-[#a0a29c] group-hover:text-white flex-shrink-0" />
                <span className="truncate font-normal">{branch}</span>
              </div>
              {isSelected && <Check size={12} className="text-white ml-2 flex-shrink-0" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
