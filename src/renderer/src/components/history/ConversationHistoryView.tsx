import React, { useState } from 'react'
import { Search, SlidersHorizontal, Folder } from 'lucide-react'
import { HistoryFilterMenu } from './HistoryFilterMenu'
import { HistoryMoreOptionsMenu } from './HistoryMoreOptionsMenu'

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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)

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

        {/* Barre de recherche + Filtre + 3 points (style macOS) */}
        <div className="flex items-center gap-2.5 w-full mb-6">
          {/* Champ recherche style Spotlight */}
          <div
            className="flex-1 flex items-center gap-2.5 px-3.5 rounded-xl transition-all duration-200 backdrop-blur-md focus-within:border-[#007aff]/60 focus-within:shadow-[0_0_15px_rgba(0,122,255,0.2)]"
            style={{
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search size={15} className="text-[#8a8c87] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder-[#7a7c78] leading-none"
              style={{
                fontSize: '13.5px'
              }}
            />
          </div>

          {/* Bouton Filtre avec bulle popover */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterOpen((prev) => !prev)
                setIsMoreOptionsOpen(false)
              }}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isFilterOpen
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#8a8c87] hover:text-white'
              }`}
              data-tooltip={isFilterOpen ? undefined : 'Filter conversations'}
              data-tooltip-side="bottom"
            >
              <SlidersHorizontal size={15} />
            </button>

            <HistoryFilterMenu
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Bouton 3 points verticaux avec bulle Mark as Read */}
          <div className="relative">
            <button
              onClick={() => {
                setIsMoreOptionsOpen((prev) => !prev)
                setIsFilterOpen(false)
              }}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isMoreOptionsOpen
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#8a8c87] hover:text-white'
              }`}
              data-tooltip={isMoreOptionsOpen ? undefined : 'More options'}
              data-tooltip-side="bottom"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="19" r="1.75" />
              </svg>
            </button>

            <HistoryMoreOptionsMenu
              isOpen={isMoreOptionsOpen}
              onClose={() => setIsMoreOptionsOpen(false)}
            />
          </div>
        </div>

        {/* Liste des conversations (cartes style macOS) */}
        <div className="flex flex-col gap-1">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectConversation?.(item)}
              className="flex flex-col py-3 px-3.5 rounded-xl transition-all duration-150 cursor-pointer hover:bg-white/[0.06] hover:shadow-sm border border-transparent hover:border-white/5"
            >
              {/* Ligne 1 : Titre de la conversation + Timestamp */}
              <div className="flex items-center justify-between w-full gap-4">
                <span
                  className="truncate flex-1 font-normal text-[#dcded9] group-hover:text-white"
                  style={{ fontSize: '14px' }}
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
              <div className="flex items-center gap-1.5 mt-1.5">
                <Folder size={13} strokeWidth={1.5} style={{ color: '#7a7c78', flexShrink: 0 }} />
                <span
                  className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-xs text-[#9a9c97]"
                  style={{ fontSize: '11.5px' }}
                >
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
