import React from 'react'

interface WorkspaceHeaderProps {
  projectName: string
  conversationTitle?: string
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  projectName,
  conversationTitle = "Je veux créer une application desktop inspirée de l'interface d'Antigr..."
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 flex-shrink-0 select-none"
      style={{
        height: 38,
        borderBottom: '1px solid #282a26',
        backgroundColor: '#181a17'
      }}
    >
      {/* Breadcrumb à gauche */}
      <div className="flex items-center gap-2 text-xs truncate max-w-xl">
        <span style={{ fontSize: '13px', color: '#9e9e9a', fontWeight: 400 }}>
          {projectName}
        </span>
        <span style={{ color: '#555852', fontSize: '13px' }}>/</span>
        <span
          className="truncate"
          style={{ fontSize: '13px', color: '#8a8c87', fontWeight: 400 }}
        >
          {conversationTitle}
        </span>
      </div>

      {/* Boutons à droite : 3 points + Right panel toggle */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Three dots menu */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-[#252723] transition-colors cursor-pointer"
          title="More options"
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
          title="Toggle Right Panel"
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
