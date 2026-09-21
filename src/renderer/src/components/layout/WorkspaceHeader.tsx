import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import appLogo from '../../assets/logo.png'

interface WorkspaceHeaderProps {
  projectName?: string
  conversationTitle?: string
  showNavControls?: boolean
  onToggleSidebar?: () => void
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  projectName,
  conversationTitle,
  showNavControls = false,
  onToggleSidebar
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 flex-shrink-0 select-none"
      style={{
        height: 38,
        backgroundColor: 'transparent'
      }}
    >
      {/* Côté gauche : Si plein écran (sidebar fermée), affiche Logo + [|] + < + >. Sinon affiche le breadcrumb du projet */}
      <div className="flex items-center gap-2 text-xs truncate max-w-xl">
        {showNavControls && (
          <div className="flex items-center gap-1 mr-2">
            {/* Logo App */}
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
              <img src={appLogo} alt="App Logo" className="w-[18px] h-[18px] object-contain rounded-sm" />
            </div>

            {/* Toggle sidebar button — pas de fond permanent, effet hover & active au clic */}
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
        )}

        {/* Breadcrumb projet (inchangé) */}
        {projectName && (
          <span style={{ fontSize: '13px', color: '#9e9e9a', fontWeight: 400 }}>
            {projectName}
          </span>
        )}
        {conversationTitle && (
          <>
            <span style={{ color: '#555852', fontSize: '13px' }}>/</span>
            <span
              className="truncate"
              style={{ fontSize: '13px', color: '#8a8c87', fontWeight: 400 }}
            >
              {conversationTitle}
            </span>
          </>
        )}
      </div>

      {/* Boutons à droite STRICTEMENT INTACTS : 3 points + Right panel toggle */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Three dots menu */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] transition-colors cursor-pointer"
          data-tooltip="More options"
          data-tooltip-side="bottom"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </button>

        {/* Right panel toggle icon */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] transition-colors cursor-pointer"
          data-tooltip="Toggle Right Panel"
          data-tooltip-side="bottom"
        >
          <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="1.5" />
            <line x1="10.5" y1="0.65" x2="10.5" y2="12.35" />
          </svg>
        </button>
      </div>
    </div>
  )
}
