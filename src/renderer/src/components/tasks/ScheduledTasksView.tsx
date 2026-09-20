import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'

export const ScheduledTasksView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col h-full w-full bg-[#181a17] text-[#eceee9] overflow-y-auto select-none">
      <div className="w-full max-w-3xl mx-auto pt-16 px-6 flex flex-col">
        {/* Header row : Titre "Scheduled Tasks" + Bouton "+ New" */}
        <div className="flex items-center justify-between w-full mb-5">
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#eceee9', letterSpacing: '-0.01em' }}>
            Scheduled Tasks
          </h1>
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>

        {/* Search input bar (style macOS Spotlight) */}
        <div
          className="flex items-center gap-2.5 px-3.5 rounded-xl w-full transition-all duration-200 backdrop-blur-md focus-within:border-[#007aff]/60 focus-within:shadow-[0_0_15px_rgba(0,122,255,0.2)]"
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
            placeholder="Search tasks..."
            className="w-full bg-transparent outline-none text-sm text-white placeholder-[#7a7c78] leading-none"
            style={{
              fontSize: '13.5px'
            }}
          />
        </div>

        {/* Empty state message */}
        <div className="flex justify-center items-center w-full mt-24">
          <span style={{ fontSize: '14px', color: '#6f716c', fontWeight: 400 }}>
            No scheduled tasks configured.
          </span>
        </div>
      </div>
    </div>
  )
}
