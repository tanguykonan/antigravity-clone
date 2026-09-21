import React, { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

export type GroupByOption = 'project' | 'workspace' | 'status' | 'none'
export type SortOption = 'last_updated' | 'last_prompt' | 'alphabetical' | 'date_added'

interface ProjectsFilterMenuProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLButtonElement | null>
}

export const ProjectsFilterMenu: React.FC<ProjectsFilterMenuProps> = ({
  isOpen,
  onClose,
  anchorRef
}) => {
  const [groupBy, setGroupBy] = useState<GroupByOption>('project')
  const [sortBy, setSortBy] = useState<SortOption>('last_updated')
  const menuRef = useRef<HTMLDivElement>(null)

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
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, anchorRef])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-50 right-2 top-full mt-1 w-[185px] rounded-xl select-none animate-in fade-in zoom-in-95 duration-100"
      style={{
        backgroundColor: '#222420',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        padding: '4px'
      }}
    >
      {/* ── Group By Section ── */}
      <div className="px-2 pt-1 pb-0.5 text-[10.5px] font-medium text-[#7a7c78]">
        Group By
      </div>
      <div className="space-y-0.5">
        <MenuItem
          label="Project"
          isSelected={groupBy === 'project'}
          onClick={() => setGroupBy('project')}
        />
        <MenuItem
          label="Workspace"
          isSelected={groupBy === 'workspace'}
          onClick={() => setGroupBy('workspace')}
        />
        <MenuItem
          label="Status"
          isSelected={groupBy === 'status'}
          onClick={() => setGroupBy('status')}
        />
        <MenuItem
          label="None"
          isSelected={groupBy === 'none'}
          onClick={() => setGroupBy('none')}
        />
      </div>

      {/* ── Divider ── */}
      <div className="my-1 border-t border-white/[0.08]" />

      {/* ── Sort Conversations Section ── */}
      <div className="px-2 pt-0.5 pb-0.5 text-[10.5px] font-medium text-[#7a7c78]">
        Sort Conversations
      </div>
      <div className="space-y-0.5">
        <MenuItem
          label="Last Updated"
          isSelected={sortBy === 'last_updated'}
          onClick={() => setSortBy('last_updated')}
        />
        <MenuItem
          label="Last Prompt"
          isSelected={sortBy === 'last_prompt'}
          onClick={() => setSortBy('last_prompt')}
        />
        <MenuItem
          label="Alphabetical (A-Z)"
          isSelected={sortBy === 'alphabetical'}
          onClick={() => setSortBy('alphabetical')}
        />
        <MenuItem
          label="Date Added"
          isSelected={sortBy === 'date_added'}
          onClick={() => setSortBy('date_added')}
        />
      </div>
    </div>
  )
}

interface MenuItemProps {
  label: string
  isSelected?: boolean
  onClick: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  isSelected = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-2 py-1 rounded-md text-left transition-colors cursor-pointer group"
      style={{
        color: isSelected ? '#ffffff' : '#dcded9',
        fontSize: '12px',
        fontWeight: isSelected ? 500 : 400
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <span className="truncate">{label}</span>
      {isSelected && (
        <Check size={12.5} strokeWidth={2.2} className="text-[#e2e4df] flex-shrink-0 ml-1.5" />
      )}
    </button>
  )
}
