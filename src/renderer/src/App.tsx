import React, { useState, useCallback } from 'react'
import { TitleBar } from './components/layout/TitleBar'
import { Sidebar, Project } from './components/layout/Sidebar'
import { ResizeHandle } from './components/layout/ResizeHandle'
import { WorkspaceHeader } from './components/layout/WorkspaceHeader'
import { ScheduledTasksView } from './components/tasks/ScheduledTasksView'
import { ConversationHistoryView } from './components/history/ConversationHistoryView'
import { ChatInput } from './components/chat/ChatInput'

const SIDEBAR_MIN_WIDTH = 240
const SIDEBAR_MAX_WIDTH = 420
const SIDEBAR_DEFAULT_WIDTH = 260

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

  return (
    <div className="flex flex-col h-screen w-screen bg-bg-base text-text-primary overflow-hidden">
      {/* Title bar — menu natif */}
      <TitleBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar avec largeur contrôlée */}
        <div style={{ width: sidebarWidth, minWidth: SIDEBAR_MIN_WIDTH, maxWidth: SIDEBAR_MAX_WIDTH }} className="flex-shrink-0 flex">
          <Sidebar
            projects={INITIAL_PROJECTS}
            activeProjectId={activeProjectId}
            activeView={activeView}
            onSelectProject={handleSelectProject}
            onNewConversation={handleNewConversation}
            onSelectView={setActiveView}
          />
          <ResizeHandle onResize={handleResize} />
        </div>

        {/* Main area */}
        <main className="flex-1 flex flex-col bg-bg-base overflow-hidden">
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
            <>
              {activeProject && (
                <WorkspaceHeader projectName={activeProject.name} />
              )}
              <div className="flex-1 overflow-hidden">
                <ChatInput projectName={activeProject?.name ?? 'desktop-llm'} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
