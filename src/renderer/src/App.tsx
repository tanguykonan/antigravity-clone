import React, { useState, useCallback, useEffect } from 'react'
import { TitleBar } from './components/layout/TitleBar'
import { Sidebar, Project } from './components/layout/Sidebar'
import { ResizeHandle } from './components/layout/ResizeHandle'
import { WorkspaceHeader } from './components/layout/WorkspaceHeader'
import { ScheduledTasksView } from './components/tasks/ScheduledTasksView'
import { ConversationHistoryView } from './components/history/ConversationHistoryView'
import { ChatInput } from './components/chat/ChatInput'
import { CommandPalette } from './components/palette/CommandPalette'
import { TooltipProvider } from './components/ui/Tooltip'
import { OnboardingView } from './components/auth/OnboardingView'
import { SettingsModal } from './components/settings/SettingsModal'

const SIDEBAR_MIN_WIDTH = 270
const SIDEBAR_MAX_WIDTH = 460
const SIDEBAR_DEFAULT_WIDTH = 285

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'desktop-llm',
    name: 'desktop-llm',
    conversations: [
      {
        id: 'c-1',
        title: "Je veux créer une application desktop inspirée de l'interface d'Antigr...",
        time: 'now'
      }
    ]
  },
  {
    id: 'SmoothTerminal',
    name: 'SmoothTerminal',
    conversations: [
      {
        id: 'c-2',
        title: 'je veux corriger mon outi...',
        time: '19h'
      }
    ]
  },
  { id: 'test-box', name: 'test-box', conversations: [] },
  { id: 'CareerLensWeb', name: 'CareerLensWeb', conversations: [] },
  { id: 'MyPortfolio', name: 'MyPortfolio', conversations: [] },
  { id: 'PC-PDL', name: 'PC-PDL', conversations: [] },
  { id: 'chatbot_medical', name: 'chatbot_medical', conversations: [] },
  { id: 'CareerLens', name: 'CareerLens', conversations: [] },
  { id: 'ATSEngine', name: 'ATSEngine', conversations: [] },
  { id: 'mobile-agent', name: 'mobile-agent', conversations: [] }
]

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('desktop_llm_authenticated') === 'true'
  )
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [activeProjectId, setActiveProjectId] = useState<string | null>('desktop-llm')
  const [lastSelectedProjectId, setLastSelectedProjectId] = useState<string>('desktop-llm')
  const [activeConversationId, setActiveConversationId] = useState<string | null>('c-1')
  const [activeView, setActiveView] = useState<'chat' | 'history' | 'scheduled-tasks'>('chat')
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) ?? null : null
  const lastSelectedProject = projects.find((p) => p.id === lastSelectedProjectId) ?? projects[0]
  const displayProject = activeProject || lastSelectedProject

  const activeConversation =
    activeProjectId && activeConversationId
      ? activeProject?.conversations?.find((c) => c.id === activeConversationId) ?? null
      : null

  const handleResize = useCallback((delta: number) => {
    setSidebarWidth((prev) =>
      Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, prev + delta))
    )
  }, [])

  // Option + New Conversation : réinitialise à un chat vide sans projet (rien dans le header)
  const handleNewConversation = () => {
    setActiveProjectId(null)
    setActiveConversationId(null)
    setActiveView('chat')
  }

  // Sélection d'un projet uniquement (ne sélectionne pas forcément un chat)
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id)
    setLastSelectedProjectId(id)
    setActiveConversationId(null)
    setActiveView('chat')
  }

  // Sélection d'une conversation spécifique d'un projet
  const handleSelectConversation = (projectId: string, conversationId: string) => {
    setActiveProjectId(projectId)
    setLastSelectedProjectId(projectId)
    setActiveConversationId(conversationId)
    setActiveView('chat')
  }

  // Création d'un nouveau chat dans un projet via le bouton (+)
  const handleCreateChatInProject = (projectId: string) => {
    const newConv = {
      id: `c-${Date.now()}`,
      title: 'New conversation',
      time: 'Just now'
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            conversations: [newConv, ...(p.conversations || [])]
          }
        }
        return p
      })
    )

    setActiveProjectId(projectId)
    setLastSelectedProjectId(projectId)
    setActiveConversationId(newConv.id)
    setActiveView('chat')
  }

  // Création d'un nouveau projet
  const handleCreateProject = () => {
    const newId = `project-${Date.now()}`
    const newProj: Project = {
      id: newId,
      name: `project-${projects.length + 1}`,
      conversations: []
    }
    setProjects((prev) => [newProj, ...prev])
    setActiveProjectId(newId)
    setLastSelectedProjectId(newId)
    setActiveConversationId(null)
  }

  // Suppression d'une conversation
  const handleDeleteConversation = (projectId: string, conversationId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            conversations: p.conversations?.filter((c) => c.id !== conversationId) || []
          }
        }
        return p
      })
    )
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
    }
  }

  // Raccourcis globaux Ctrl+Shift+P (Command Palette) et Ctrl+, (Settings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      } else if ((e.ctrlKey || e.metaKey) && (e.key === ',' || e.key === '<')) {
        e.preventDefault()
        setIsSettingsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#151613] text-text-primary overflow-hidden">
        {/* Title bar pour contrôle fenêtre & déplacement */}
        <TitleBar onOpenCommandPalette={() => {}} />
        <div className="flex-1 overflow-hidden">
          <OnboardingView
            onLoginSuccess={(provider) => {
              localStorage.setItem('desktop_llm_authenticated', 'true')
              localStorage.setItem('desktop_llm_auth_provider', provider)
              setIsAuthenticated(true)
            }}
          />
        </div>
      </div>
    )
  }

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
              projects={projects}
              activeProjectId={activeProjectId}
              activeConversationId={activeConversationId}
              activeView={activeView}
              onSelectProject={handleSelectProject}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onCreateChatInProject={handleCreateChatInProject}
              onDeleteConversation={handleDeleteConversation}
              onReorderProjects={setProjects}
              onSelectView={setActiveView}
              onToggleSidebar={() => setSidebarOpen(false)}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
          {sidebarOpen && <ResizeHandle onResize={handleResize} />}
        </div>

        {/* Main area — s'élargit en plein écran avec fluidité */}
        <main className="flex-1 flex flex-col bg-bg-base overflow-hidden">
          {/* Header de travail : affiche le breadcrumb 'Projet / Titre' si sélectionné, sinon rien */}
          <WorkspaceHeader
            projectName={activeProject?.name}
            conversationTitle={activeConversation?.title}
            showNavControls={!sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(true)}
          />

          <div className="flex-1 overflow-hidden">
            {activeView === 'scheduled-tasks' ? (
              <ScheduledTasksView projects={projects} />
            ) : activeView === 'history' ? (
              <ConversationHistoryView
                onSelectConversation={(entry) => {
                  const targetProject = projects.find((p) => p.name === entry.projectName)
                  if (targetProject) {
                    setActiveProjectId(targetProject.id)
                    setLastSelectedProjectId(targetProject.id)
                    const targetConv = targetProject.conversations?.find((c) => c.title === entry.title)
                    if (targetConv) {
                      setActiveConversationId(targetConv.id)
                    } else {
                      setActiveConversationId(null)
                    }
                  } else {
                    setActiveProjectId(null)
                    setActiveConversationId(null)
                  }
                  setActiveView('chat')
                }}
              />
            ) : (
              <ChatInput
                projectName={displayProject?.name ?? 'desktop-llm'}
                projects={projects}
                selectedProjectId={displayProject?.id ?? 'desktop-llm'}
                onSelectProject={handleSelectProject}
                onCreateProject={handleCreateProject}
                hasActiveConversation={Boolean(activeProjectId && activeConversationId)}
              />
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
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Modal Settings complet fidèle au design */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        projects={projects}
        onSignOut={() => {
          localStorage.removeItem('desktop_llm_authenticated')
          setIsAuthenticated(false)
        }}
      />

      {/* Tooltip macOS global (capsules verre dépoli) */}
      <TooltipProvider />
    </div>
  )
}
