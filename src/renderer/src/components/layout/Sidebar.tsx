import React from 'react'
import { Plus, History, CalendarClock, Folder, Settings, SlidersHorizontal, FolderPlus } from 'lucide-react'

export interface Project {
  id: string
  name: string
  lastMessage?: string
  lastTime?: string
}

interface SidebarProps {
  projects: Project[]
  activeProjectId: string | null
  onSelectProject: (id: string) => void
  onNewConversation: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewConversation
}) => {
  return (
    <aside className="w-52 flex flex-col bg-bg-sidebar border-r border-bg-border select-none flex-shrink-0 h-full">
      {/* Top nav items */}
      <div className="flex flex-col pt-1 pb-1">
        {/* New Conversation */}
        <button
          onClick={onNewConversation}
          className="flex items-center gap-2.5 mx-2 my-0.5 px-2.5 py-1.5 rounded text-sm text-text-primary bg-bg-active hover:bg-bg-hover transition-colors"
        >
          <Plus size={14} className="text-text-secondary flex-shrink-0" />
          <span className="font-medium">New Conversation</span>
        </button>

        {/* Conversation History */}
        <button className="flex items-center gap-2.5 mx-2 my-0.5 px-2.5 py-1.5 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors">
          <History size={14} className="flex-shrink-0" />
          <span>Conversation History</span>
        </button>

        {/* Scheduled Tasks */}
        <button className="flex items-center gap-2.5 mx-2 my-0.5 px-2.5 py-1.5 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors">
          <CalendarClock size={14} className="flex-shrink-0" />
          <span>Scheduled Tasks</span>
        </button>
      </div>

      {/* Separator */}
      <div className="h-px bg-bg-border mx-2 my-1" />

      {/* Projects section */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">Projects</span>
        <div className="flex items-center gap-1">
          <button className="w-5 h-5 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
            <SlidersHorizontal size={11} />
          </button>
          <button className="w-5 h-5 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
            <FolderPlus size={11} />
          </button>
        </div>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full flex flex-col items-start gap-0.5 px-3 py-1.5 text-left transition-colors ${
              activeProjectId === project.id
                ? 'text-text-primary bg-bg-hover'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <Folder size={12} className="flex-shrink-0 text-text-muted" />
              <span className="text-sm truncate flex-1">{project.name}</span>
            </div>
            {project.lastMessage && (
              <div className="flex items-center gap-2 w-full pl-5">
                <span className="text-2xs text-text-muted truncate flex-1">{project.lastMessage}</span>
                {project.lastTime && (
                  <span className="text-2xs text-text-muted flex-shrink-0">{project.lastTime}</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom - Settings */}
      <div className="border-t border-bg-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors">
          <Settings size={14} className="flex-shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
