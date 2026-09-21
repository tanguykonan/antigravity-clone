import React, { useState, useRef } from 'react'
import { Plus, History, CalendarClock, Folder, Settings, FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import appLogo from '../../assets/logo.png'
import { ProjectsFilterMenu } from './ProjectsFilterMenu'
import { ProjectOptionsMenu } from './ProjectOptionsMenu'

export interface ConversationItem {
  id: string
  title: string
  time?: string
  lastMessage?: string
}

export interface ProjectItem {
  id: string
  name: string
  conversations?: ConversationItem[]
  lastMessage?: string
  lastTime?: string
}

export type Project = ProjectItem

interface SidebarProps {
  projects: ProjectItem[]
  activeProjectId: string | null
  activeConversationId: string | null
  activeView: 'chat' | 'history' | 'scheduled-tasks'
  onSelectProject: (id: string) => void
  onSelectConversation: (projectId: string, conversationId: string) => void
  onNewConversation: () => void
  onCreateChatInProject: (projectId: string) => void
  onSelectView: (view: 'chat' | 'history' | 'scheduled-tasks') => void
  onToggleSidebar?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  activeConversationId,
  activeView,
  onSelectProject,
  onSelectConversation,
  onNewConversation,
  onCreateChatInProject,
  onSelectView,
  onToggleSidebar
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [openProjectOptionsId, setOpenProjectOptionsId] = useState<string | null>(null)
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(
    new Set(['desktop-llm', 'SmoothTerminal'])
  )
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const projectButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const handleToggleExpand = (projectId: string) => {
    setExpandedProjectIds((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

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
        style={{ height: 38 }}
      >
        {/* Logo App */}
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          <img src={appLogo} alt="App Logo" className="w-[18px] h-[18px] object-contain rounded-sm" />
        </div>

        {/* Panel toggle — pas de pill permanent, effet hover & active clic */}
        <button
          onClick={onToggleSidebar}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] active:bg-white/10 active:scale-95 cursor-pointer"
          data-tooltip="Toggle Sidebar"
          data-tooltip-side="bottom"
        >
          <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="1.5" />
            <line x1="4.5" y1="0.65" x2="4.5" y2="12.35" />
          </svg>
        </button>

        {/* Back */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded transition-colors text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] active:scale-95 cursor-pointer"
          data-tooltip="Back"
          data-tooltip-side="bottom"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Forward */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded transition-colors text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] active:scale-95 cursor-pointer"
          data-tooltip="Forward"
          data-tooltip-side="bottom"
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
      <div className="relative flex items-center justify-between pl-3 pr-0 pt-3 pb-1 flex-shrink-0">
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#8a8c87' }}>Projects</span>
        <div className="flex items-center gap-1">
          <button
            ref={filterButtonRef}
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            className={`w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer ${
              isFilterMenuOpen
                ? 'bg-white/10 text-white'
                : 'text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-white/[0.04]'
            }`}
            data-tooltip={isFilterMenuOpen ? undefined : 'Display Options'}
            data-tooltip-side="top"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 3.5zm2.5 4.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H4.25A.75.75 0 0 1 3.5 8zm3 4.5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1-.75-.75z" />
            </svg>
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center rounded transition-colors text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-white/[0.04] cursor-pointer"
            data-tooltip="Create New Project"
            data-tooltip-side="top"
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

        {/* ── Popover Bulle Filter Menu ── */}
        <ProjectsFilterMenu
          isOpen={isFilterMenuOpen}
          onClose={() => setIsFilterMenuOpen(false)}
          anchorRef={filterButtonRef}
        />
      </div>

      {/* ── Project List avec Scrollbar personnalisée à coins arrondis ── */}
      <div className="sidebar-scrollbar flex-1 overflow-y-auto px-2 space-y-1">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId
          return (
            <div key={project.id} className="flex flex-col">
              {/* Ligne principale du projet */}
              <div
                onClick={() => {
                  onSelectProject(project.id)
                  handleToggleExpand(project.id)
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all duration-150 cursor-pointer group select-none"
                style={{
                  height: 36,
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                  boxShadow: isActive ? 'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 2px 6px rgba(0,0,0,0.2)' : 'none',
                  color: isActive ? '#ffffff' : '#a8aaa4'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                    e.currentTarget.style.color = '#ffffff'
                    const icon = e.currentTarget.querySelector<HTMLElement>('.folder-icon')
                    if (icon) icon.style.color = '#c5c7c2'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#a8aaa4'
                    const icon = e.currentTarget.querySelector<HTMLElement>('.folder-icon')
                    if (icon) icon.style.color = '#8a8c87'
                  }
                }}
              >
                <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                  <Folder
                    size={16}
                    strokeWidth={1.6}
                    className="folder-icon flex-shrink-0"
                    style={{
                      color: isActive ? '#007aff' : '#8a8c87',
                      transition: 'color 150ms ease'
                    }}
                  />
                  <span
                    className="truncate"
                    style={{ fontSize: '14px', fontWeight: isActive ? 500 : 400 }}
                  >
                    {project.name}
                  </span>
                </div>

                {/* Actions rapides au survol (style macOS : ⋮ et +) */}
                <div
                  className={`flex items-center gap-1 transition-opacity flex-shrink-0 ml-1 ${
                    openProjectOptionsId === project.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="relative">
                    <button
                      ref={(el) => {
                        projectButtonRefs.current[project.id] = el
                      }}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenProjectOptionsId((prev) => (prev === project.id ? null : project.id))
                      }}
                      className={`w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors ${
                        openProjectOptionsId === project.id
                          ? 'bg-white/10 text-white'
                          : 'text-[#8a8c87] hover:text-white'
                      }`}
                      data-tooltip={openProjectOptionsId === project.id ? undefined : 'Project options'}
                      data-tooltip-side="top"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.75" />
                        <circle cx="12" cy="12" r="1.75" />
                        <circle cx="12" cy="19" r="1.75" />
                      </svg>
                    </button>
                    <ProjectOptionsMenu
                      isOpen={openProjectOptionsId === project.id}
                      onClose={() => setOpenProjectOptionsId(null)}
                      projectName={project.name}
                      anchorRef={{ current: projectButtonRefs.current[project.id] ?? null }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedProjectIds((prev) => new Set(prev).add(project.id))
                      onCreateChatInProject(project.id)
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-[#8a8c87] hover:text-white transition-colors cursor-pointer"
                    data-tooltip="New chat in project"
                    data-tooltip-side="top"
                  >
                    <Plus size={13} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Sous-éléments de conversation (affichés si le projet est déplié) */}
              {expandedProjectIds.has(project.id) && project.conversations && project.conversations.length > 0 ? (
                <div className="flex flex-col space-y-0.5">
                  {project.conversations.map((conv) => {
                    const isConvActive =
                      activeProjectId === project.id && activeConversationId === conv.id

                    return (
                      <div
                        key={conv.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectConversation(project.id, conv.id)
                        }}
                        className={`flex items-center justify-between py-1 px-2.5 my-0.5 rounded-md cursor-pointer transition-colors duration-150 select-none ${
                          isConvActive
                            ? 'bg-white/[0.04] text-[#eceee9]'
                            : 'text-[#8a8c87] hover:bg-white/[0.025] hover:text-[#c5c7c2]'
                        }`}
                        style={{
                          marginLeft: '22px',
                          marginRight: '4px'
                        }}
                      >
                        <span
                          className="truncate flex-1 font-normal"
                          style={{
                            fontSize: '12.5px',
                            color: isConvActive ? '#eceee9' : undefined
                          }}
                        >
                          {conv.title}
                        </span>
                        {conv.time && (
                          <span
                            className={`px-1 py-0.5 rounded text-[10px] font-mono ml-2 flex-shrink-0 transition-colors ${
                              isConvActive
                                ? 'text-[#a0a29c]'
                                : 'text-[#6f716c]'
                            }`}
                          >
                            {conv.time}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : expandedProjectIds.has(project.id) && project.lastMessage ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectProject(project.id)
                  }}
                  className="flex items-center justify-between py-1.5 px-2 my-0.5 rounded-md cursor-pointer transition-all duration-150 hover:bg-white/[0.04] group/sub"
                  style={{ marginLeft: '22px', marginRight: '4px', color: '#8a8c87' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8c87')}
                >
                  <span
                    className="truncate flex-1 font-normal"
                    style={{ fontSize: '12.5px' }}
                  >
                    {project.lastMessage}
                  </span>
                  {project.lastTime && (
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[10.5px] font-mono text-[#7a7c78] group-hover/sub:text-[#a8aaa4] transition-colors ml-2 flex-shrink-0">
                      {project.lastTime}
                    </span>
                  )}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Flèche du bas ▼ centrée exactement sur la colonne de 10px de la scrollbar */}
      <div className="flex justify-end pr-0 py-0.5 flex-shrink-0">
        <div className="w-[10px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
          <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
            <polygon points="3.5,5 7,0 0,0" fill="#6f716c" />
          </svg>
        </div>
      </div>

      {/* ── Settings (au bas de la sidebar — style macOS permanent avec rotation au hover) ── */}
      <div
        className="p-2 flex-shrink-0"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(30, 32, 29, 0.95)'
        }}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-2.5 rounded-lg transition-all duration-200 text-left select-none cursor-pointer group active:scale-[0.98]"
          style={{
            height: 34,
            color: '#dcded9',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.09)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'
            e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 12px rgba(0, 0, 0, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#dcded9'
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)'
            e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Settings
              size={15}
              strokeWidth={1.8}
              className="flex-shrink-0 text-[#a8aaa4] group-hover:text-white transition-all duration-500 ease-out group-hover:rotate-90"
            />
            <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em' }}>
              Settings
            </span>
          </div>

          {/* Badge raccourci clavier macOS permanent */}
          <span className="text-[11px] font-mono text-[#8a8c87] group-hover:text-white px-1.5 py-0.5 rounded bg-white/[0.04] group-hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-150">
            Ctrl+,
          </span>
        </button>
      </div>
    </aside>
  )
}
