import React, { useState, useEffect, useRef } from 'react'
import { Search, Folder, Check, FolderPlus, FolderSync } from 'lucide-react'
import { Project } from '../layout/Sidebar'

interface ProjectSelectorDropdownProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  selectedProjectId: string
  onSelectProject: (id: string) => void
  onCreateProject?: () => void
}

export const ProjectSelectorDropdown: React.FC<ProjectSelectorDropdownProps> = ({
  isOpen,
  onClose,
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

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

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-1.5 w-60 rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
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
      {/* ── Search Input ── */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 mb-1">
        <Search size={13} className="text-[#7a7c78] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Projects"
          className="w-full bg-transparent text-[#e2e4df] placeholder-[#7a7c78] text-[12.5px] outline-none border-none p-0"
        />
      </div>

      {/* ── Projects List ── */}
      <div className="max-h-56 overflow-y-auto sidebar-scrollbar space-y-0.5 py-0.5">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const isSelected = project.id === selectedProjectId
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onSelectProject(project.id)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer group ${
                  isSelected ? 'bg-white/[0.08] text-white font-medium' : 'text-[#c5c7c2] hover:bg-white/[0.05] hover:text-white'
                }`}
                style={{ fontSize: '12.5px' }}
              >
                <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                  <Folder
                    size={14}
                    strokeWidth={1.6}
                    className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#8a8c87] group-hover:text-[#c5c7c2]'}`}
                  />
                  <span className="truncate">{project.name}</span>
                </div>
                {isSelected && (
                  <Check size={13.5} strokeWidth={2.2} className="text-white flex-shrink-0 ml-2" />
                )}
              </button>
            )
          })
        ) : (
          <div className="px-3 py-2 text-center text-xs text-[#7a7c78]">
            No projects found
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="my-1 border-t border-white/[0.08]" />

      {/* ── Bottom Actions ── */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => {
            if (onCreateProject) onCreateProject()
            onClose()
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-[#c5c7c2] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px' }}
        >
          <FolderPlus size={14} className="text-[#8a8c87] group-hover:text-white flex-shrink-0" />
          <span className="truncate">New Project</span>
        </button>

        <button
          type="button"
          onClick={() => onClose()}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-[#c5c7c2] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer group"
          style={{ fontSize: '12.5px' }}
        >
          <FolderSync size={14} className="text-[#8a8c87] group-hover:text-white flex-shrink-0" />
          <span className="truncate">Quick Start</span>
        </button>
      </div>
    </div>
  )
}
