import React from 'react'
import { Plus, History, CalendarClock, Folder, Settings, SlidersHorizontal, FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react'

export interface ProjectItem {
  id: string
  name: string
  isActive?: boolean
  lastMessage?: string
  lastTime?: string
  conversations?: { id: string; title: string; time: string; isActive?: boolean }[]
}

export type Project = ProjectItem

interface SidebarProps {
  projects: ProjectItem[]
  activeProjectId: string | null
  activeView: 'chat' | 'history' | 'scheduled-tasks'
  onSelectProject: (id: string) => void
  onNewConversation: () => void
  onSelectView: (view: 'chat' | 'history' | 'scheduled-tasks') => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  activeView,
  onSelectProject,
  onNewConversation,
  onSelectView
}) => {
  return (
    <aside
      className="flex flex-col select-none h-full w-full overflow-hidden"
      style={{
        backgroundColor: '#1e201d',
        color: '#9e9e9a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* ── Mini header : Logo A + Panel icon + Nav arrows ── */}
      <div
        className="flex items-center gap-1 px-2 flex-shrink-0"
        style={{ height: 38, borderBottom: '1px solid #282a26' }}
      >
        {/* Logo A stylisé Antigravity */}
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L21 19H3L12 3Z"
              stroke="#e2e4df"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Panel toggle */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: '#7a7c78' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
          title="Toggle Sidebar"
        >
          <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="1.5" />
            <line x1="4.5" y1="0.65" x2="4.5" y2="12.35" />
          </svg>
        </button>

        {/* Back */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: '#7a7c78' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
          title="Back"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Forward */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: '#7a7c78' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
          title="Forward"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Top Navigation Items ── */}
      <div className="flex flex-col pt-2 pb-1 px-2 gap-0.5">
        {/* New Conversation */}
        <button
          onClick={() => {
            onNewConversation()
            onSelectView('chat')
          }}
          className="flex items-center gap-2.5 px-3 rounded-lg transition-colors text-left overflow-hidden cursor-pointer"
          style={{
            height: 34,
            fontSize: '13.5px',
            fontWeight: 500,
            color: activeView === 'chat' && activeProjectId === null ? '#eceee9' : '#b0b2ac',
            backgroundColor: activeView === 'chat' && activeProjectId === null ? '#2b2d29' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!(activeView === 'chat' && activeProjectId === null)) {
              e.currentTarget.style.backgroundColor = '#242622'
              e.currentTarget.style.color = '#eceee9'
            }
          }}
          onMouseLeave={(e) => {
            if (!(activeView === 'chat' && activeProjectId === null)) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#b0b2ac'
            }
          }}
        >
          <Plus size={15} strokeWidth={2.5} style={{ color: '#eceee9', flexShrink: 0 }} />
          <span className="whitespace-nowrap truncate">New Conversation</span>
        </button>

        {/* Conversation History */}
        <button
          onClick={() => onSelectView('history')}
          className="flex items-center gap-2.5 px-3 rounded-lg transition-colors text-left overflow-hidden cursor-pointer"
          style={{
            height: 32,
            fontSize: '13.5px',
            fontWeight: 400,
            color: activeView === 'history' ? '#eceee9' : '#9a9c97',
            backgroundColor: activeView === 'history' ? '#2b2d29' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (activeView !== 'history') {
              e.currentTarget.style.backgroundColor = '#242622'
              e.currentTarget.style.color = '#dcded9'
            }
          }}
          onMouseLeave={(e) => {
            if (activeView !== 'history') {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9a9c97'
            }
          }}
        >
          <History size={15} style={{ flexShrink: 0, color: activeView === 'history' ? '#eceee9' : '#8a8c87' }} />
          <span className="whitespace-nowrap truncate">Conversation History</span>
        </button>

        {/* Scheduled Tasks */}
        <button
          onClick={() => onSelectView('scheduled-tasks')}
          className="flex items-center gap-2.5 px-3 rounded-lg transition-colors text-left overflow-hidden cursor-pointer"
          style={{
            height: 32,
            fontSize: '13.5px',
            fontWeight: 400,
            color: activeView === 'scheduled-tasks' ? '#eceee9' : '#9a9c97',
            backgroundColor: activeView === 'scheduled-tasks' ? '#2b2d29' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (activeView !== 'scheduled-tasks') {
              e.currentTarget.style.backgroundColor = '#242622'
              e.currentTarget.style.color = '#dcded9'
            }
          }}
          onMouseLeave={(e) => {
            if (activeView !== 'scheduled-tasks') {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9a9c97'
            }
          }}
        >
          <CalendarClock size={15} style={{ flexShrink: 0, color: activeView === 'scheduled-tasks' ? '#eceee9' : '#8a8c87' }} />
          <span className="whitespace-nowrap truncate">Scheduled Tasks</span>
        </button>
      </div>

      {/* ── Projects Header ── */}
      <div className="flex items-center justify-between pl-3 pr-0 pt-3 pb-1 flex-shrink-0">
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#8a8c87' }}>Projects</span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: '#7a7c78' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
            title="Filter"
          >
            <SlidersHorizontal size={13} />
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: '#7a7c78' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
          {/* Flèche ▲ centrée exactement sur la colonne de 10px de la scrollbar */}
          <div className="w-[10px] flex items-center justify-center">
            <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
              <polygon points="3.5,0 7,5 0,5" fill="#7a7c78" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Project List avec Scrollbar personnalisée à coins arrondis ── */}
      <div className="sidebar-scrollbar flex-1 overflow-y-auto px-2 space-y-1">
        {/* Projets de la liste */}
        {projects.map((project) => {
          const isActive = project.id === activeProjectId
          return (
            <div key={project.id} className="flex flex-col">
              {/* Ligne principale du projet */}
              <button
                onClick={() => onSelectProject(project.id)}
                className="w-full flex items-center gap-2.5 px-3 rounded-lg text-left transition-colors cursor-pointer"
                style={{
                  height: 36,
                  backgroundColor: isActive ? '#343632' : 'transparent',
                  color: isActive ? '#f0f0ee' : '#9e9e9a'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#262824'
                    e.currentTarget.style.color = '#dcded9'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#9e9e9a'
                  }
                }}
              >
                <Folder
                  size={17}
                  strokeWidth={1.5}
                  style={{ flexShrink: 0, color: isActive ? '#dcded9' : '#8a8c87' }}
                />
                <span
                  className="truncate flex-1"
                  style={{ fontSize: '14.5px', fontWeight: isActive ? 500 : 400 }}
                >
                  {project.name}
                </span>
              </button>

              {/* Sous-élément de conversation (ex: SmoothTerminal) */}
              {project.lastMessage && (
                <div
                  className="flex items-center justify-between py-1.5 pr-2 cursor-pointer rounded-md transition-colors"
                  style={{ paddingLeft: '32px', color: '#8a8c87' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8c87')}
                >
                  <span
                    className="truncate flex-1"
                    style={{ fontSize: '13.5px' }}
                  >
                    {project.lastMessage}
                  </span>
                  {project.lastTime && (
                    <span
                      style={{ fontSize: '12px', color: '#8a8c87', marginLeft: 8, flexShrink: 0 }}
                    >
                      {project.lastTime}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Flèche du bas ▼ centrée exactement sur la colonne de 10px de la scrollbar */}
      <div className="flex justify-end pr-0 py-0.5 flex-shrink-0">
        <div className="w-[10px] flex items-center justify-center">
          <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
            <polygon points="3.5,5 7,0 0,0" fill="#3c3e39" />
          </svg>
        </div>
      </div>

      {/* ── Settings (au bas de la sidebar) ── */}
      <div
        className="px-2 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid #282a26' }}
      >
        <button
          className="w-full flex items-center gap-2.5 px-3 rounded-lg transition-colors text-left"
          style={{
            height: 36,
            fontSize: '14px',
            fontWeight: 400,
            color: '#dcded9'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#262824'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#dcded9'
          }}
        >
          <Settings size={16} strokeWidth={1.5} style={{ flexShrink: 0, color: '#dcded9' }} />
          <span style={{ fontWeight: 400 }}>Settings</span>
        </button>
      </div>
    </aside>
  )
}
