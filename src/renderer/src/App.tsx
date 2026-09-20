import React, { useState, useCallback, useEffect } from 'react'
import { TitleBar } from './components/layout/TitleBar'
import { Sidebar, Project } from './components/layout/Sidebar'
import { ResizeHandle } from './components/layout/ResizeHandle'
import { WorkspaceHeader } from './components/layout/WorkspaceHeader'
import { ScheduledTasksView } from './components/tasks/ScheduledTasksView'
import { ConversationHistoryView } from './components/history/ConversationHistoryView'
import { ChatInput } from './components/chat/ChatInput'
import { CommandPalette } from './components/palette/CommandPalette'

const SIDEBAR_MIN_WIDTH = 270
const SIDEBAR_MAX_WIDTH = 460
const SIDEBAR_DEFAULT_WIDTH = 285

const INITIAL_PROJECTS: Project[] = [
  { id: 'desktop-llm', name: 'desktop-llm' },
  {
    id: 'SmoothTerminal',
    name: 'SmoothTerminal',
    lastMessage: 'je veux corriger mon outi...',
    lastTime: '19h'
  },
  { id: 'test-box', name: 'test-box' },
  { id: 'CareerLensWeb', name: 'CareerLensWeb' },
  { id: 'MyPortfolio', name: 'MyPortfolio' },
  { id: 'PC-PDL', name: 'PC-PDL' },
  { id: 'chatbot_medical', name: 'chatbot_medical' },
  { id: 'CareerLens', name: 'CareerLens' },
  { id: 'ATSEngine', name: 'ATSEngine' },
  { id: 'mobile-agent', name: 'mobile-agent' },
  { id: 'CloudSync', name: 'CloudSync' }
]

export const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>('desktop-llm')
  const [activeView, setActiveView] = useState<'chat' | 'history' | 'scheduled-tasks'>('chat')
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const activeProject = INITIAL_PROJECTS.find((p) => p.id === activeProjectId) ?? null

  const handleResize = useCallback((delta: number) => {
    setSidebarWidth((prev) =>
      Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, prev + delta))
    )
  }, [])

  const handleNewConversation = () => {
    setActiveProjectId(null)
    setActiveView('chat')
  }

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id)
    setActiveView('chat')
  }

  // Raccourci global Ctrl+Shift+P / Cmd+Shift+P pour ouvrir la palette de commande
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-bg-base text-text-primary overflow-hidden">
      {/* Title bar — STRICTEMENT INTACTE avec déclencheur Command Palette */}
      <TitleBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar animée avec glissement fluide (transition width macOS) */}
        <div
          className="flex-shrink-0 flex overflow-hidden"
          style={{
            width: sidebarOpen ? sidebarWidth : 0,
            transition: 'width 260ms cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <div
            style={{ width: sidebarWidth, minWidth: sidebarWidth }}
            className="h-full flex flex-col flex-shrink-0 overflow-hidden"
          >
            <Sidebar
              projects={INITIAL_PROJECTS}
              activeProjectId={activeProjectId}
              activeView={activeView}
              onSelectProject={handleSelectProject}
              onNewConversation={handleNewConversation}
              onSelectView={setActiveView}
              onToggleSidebar={() => setSidebarOpen(false)}
            />
          </div>
          {sidebarOpen && <ResizeHandle onResize={handleResize} />}
        </div>

        {/* Main area — s'élargit en plein écran avec fluidité */}
        <main className="flex-1 flex flex-col bg-bg-base overflow-hidden border-t border-bg-border">
          {/* Header de travail : affiche le breadcrumb à gauche + toggle droit intact. En plein écran (!sidebarOpen), affiche aussi Logo A + [|] + < + > */}
          <WorkspaceHeader
            projectName={activeProject?.name}
            showNavControls={!sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 overflow-hidden">
            {activeView === 'scheduled-tasks' ? (
              <ScheduledTasksView />
            ) : activeView === 'history' ? (
              <ConversationHistoryView
                onSelectConversation={(entry) => {
                  setActiveProjectId(entry.projectName)
                  setActiveView('chat')
                }}
              />
            ) : (
              <ChatInput projectName={activeProject?.name ?? 'desktop-llm'} />
            )}
          </div>
        </main>
      </div>

      {/* Bulle flottante Command Palette — style macOS Spotlight centré */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onNewConversation={handleNewConversation}
      />
    </div>
  )
}
