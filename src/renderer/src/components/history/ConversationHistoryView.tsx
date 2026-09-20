import React, { useState } from 'react'
import { Search, SlidersHorizontal, Folder } from 'lucide-react'

export interface HistoryEntry {
  id: string
  title: string
  projectName: string
  time: string
}

const DEFAULT_HISTORY: HistoryEntry[] = [
  {
    id: '1',
    title: "Je veux créer une application desktop inspirée de l'interface d'Antigravity Desktop 2.0.",
    projectName: 'desktop-llm',
    time: 'now'
  },
  {
    id: '2',
    title: "je veux corriger mon outile ppour qu'il fonctionne aussi sur la desniere version de kali lin...",
    projectName: 'SmoothTerminal',
    time: '21h'
  },
  {
    id: '3',
    title: 'Analyses CLI',
    projectName: 'test-box',
    time: '3d'
  },
  {
    id: '4',
    title: 'Refonte Landing Page Et Header',
    projectName: 'CareerLensWeb',
    time: '4d'
  },
  {
    id: '5',
    title: 'Website',
    projectName: 'test-box',
    time: '5d'
  },
  {
    id: '6',
    title: 'app mobile',
    projectName: 'test-box',
    time: '5d'
  },
  {
    id: '7',
    title: 'Optimiser Son Portfolio',
    projectName: 'MyPortfolio',
    time: '7d'
  },
  {
    id: '8',
    title: 'Generate README',
    projectName: 'test-box',
    time: '7d'
  },
  {
    id: '9',
    title: 'PDL-AI Technical Project Description',
    projectName: 'PC-PDL',
    time: '13d'
  }
]

interface ConversationHistoryViewProps {
  onSelectConversation?: (entry: HistoryEntry) => void
}

export const ConversationHistoryView: React.FC<ConversationHistoryViewProps> = ({
  onSelectConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredHistory = DEFAULT_HISTORY.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full w-full bg-[#181a17] text-[#eceee9] overflow-y-auto select-none">
      <div className="w-full max-w-3xl mx-auto pt-16 px-6 pb-16 flex flex-col">
        {/* Titre "Conversation History" */}
        <div className="w-full mb-5">
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#eceee9', letterSpacing: '-0.01em' }}>
            Conversation History
          </h1>
        </div>

        {/* Barre de recherche + Filtre + 3 points */}
        <div className="flex items-center gap-2 w-full mb-6">
          {/* Champ recherche */}
          <div
            className="flex-1 flex items-center gap-2.5 px-3.5 rounded-lg transition-colors"
            style={{
              height: '38px',
              backgroundColor: '#242622',
              border: '1px solid #31332e'
            }}
          >
            <Search size={15} style={{ color: '#7a7c78', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent outline-none text-sm leading-none"
              style={{
                color: '#eceee9',
                fontSize: '13.5px'
              }}
            />
          </div>

          {/* Bouton Filtre */}
          <button
            className="w-[38px] h-[38px] flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: '#242622',
              border: '1px solid #31332e',
              color: '#7a7c78'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
            title="Filter conversations"
          >
            <SlidersHorizontal size={15} />
          </button>

          {/* Bouton 3 points verticaux */}
          <button
            className="w-[38px] h-[38px] flex items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: '#242622',
              border: '1px solid #31332e',
              color: '#7a7c78'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c5c7c2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
            title="More options"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="12" cy="19" r="1.75" />
            </svg>
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="flex flex-col divide-y divide-[#222420]">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectConversation?.(item)}
              className="flex flex-col py-3 px-2 rounded-lg transition-colors cursor-pointer"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222420')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Ligne 1 : Titre de la conversation + Timestamp */}
              <div className="flex items-center justify-between w-full gap-4">
                <span
                  className="truncate flex-1 font-normal"
                  style={{ fontSize: '14px', color: '#dcded9' }}
                >
                  {item.title}
                </span>
                <span
                  style={{ fontSize: '12.5px', color: '#7a7c78', flexShrink: 0 }}
                >
                  {item.time}
                </span>
              </div>

              {/* Ligne 2 : Icône dossier + Nom du projet */}
              <div className="flex items-center gap-1.5 mt-1">
                <Folder size={13} strokeWidth={1.5} style={{ color: '#7a7c78', flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: '#8a8c87' }}>
                  {item.projectName}
                </span>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="flex justify-center items-center py-16 text-sm" style={{ color: '#6f716c' }}>
              No conversations found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
