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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: '#343632',
              border: '1px solid #41443e',
              color: '#eceee9'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3e413a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#343632')}
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>

        {/* Search input bar */}
        <div
          className="flex items-center gap-2.5 px-3.5 rounded-lg w-full transition-colors"
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
            placeholder="Search tasks..."
            className="w-full bg-transparent outline-none text-sm leading-none"
            style={{
              color: '#eceee9',
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
