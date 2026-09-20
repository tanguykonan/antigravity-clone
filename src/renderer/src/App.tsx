import React, { useState } from 'react'
import { TitleBar } from './components/layout/TitleBar'
import { Sidebar, Project } from './components/layout/Sidebar'
import { ChatInput } from './components/chat/ChatInput'

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
  { id: 'ATSEngine', name: 'ATSEngine' }
]

export const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>('desktop-llm')

  const activeProject = INITIAL_PROJECTS.find((p) => p.id === activeProjectId) ?? null

  const handleNewConversation = () => {
    setActiveProjectId(null)
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-bg-base text-text-primary overflow-hidden">
      {/* Title bar */}
      <TitleBar activeProject={activeProject?.name ?? null} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          projects={INITIAL_PROJECTS}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
          onNewConversation={handleNewConversation}
        />

        {/* Main area — vide, juste l'input centré */}
        <main className="flex-1 bg-bg-base overflow-hidden">
          <ChatInput projectName={activeProject?.name ?? null} />
        </main>
      </div>
    </div>
  )
}
