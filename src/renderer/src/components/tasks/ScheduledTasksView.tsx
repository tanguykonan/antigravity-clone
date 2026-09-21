import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Project } from '../layout/Sidebar'
import { NewScheduledTaskModal, ScheduledTask } from './NewScheduledTaskModal'
import { ScheduledTaskOptionsMenu } from './ScheduledTaskOptionsMenu'

interface ScheduledTasksViewProps {
  projects?: Project[]
}

export const ScheduledTasksView: React.FC<ScheduledTasksViewProps> = ({
  projects = []
}) => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null)

  const handleAddTask = (newTask: Omit<ScheduledTask, 'id' | 'createdAt'>) => {
    const task: ScheduledTask = {
      ...newTask,
      enabled: true,
      id: `task-${Date.now()}`,
      createdAt: Date.now()
    }
    setTasks((prev) => [task, ...prev])
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (openOptionsId === id) setOpenOptionsId(null)
  }

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t))
    )
  }

  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full w-full bg-[#181a17] text-[#eceee9] overflow-y-auto select-none">
      <div className="w-full max-w-3xl mx-auto pt-16 px-6 pb-16 flex flex-col">
        {/* Header row : Titre "Scheduled Tasks" + Bouton "+ New" */}
        <div className="flex items-center justify-between w-full mb-5">
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#eceee9', letterSpacing: '-0.01em' }}>
            Scheduled Tasks
          </h1>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 border border-white/10 text-white shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>

        {/* Search input bar (style macOS Spotlight) */}
        <div
          className="flex items-center gap-2.5 px-3.5 rounded-xl w-full mb-6 transition-all duration-200 backdrop-blur-md focus-within:border-[#007aff]/60 focus-within:shadow-[0_0_15px_rgba(0,122,255,0.2)]"
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

        {/* Task list or empty state */}
        {filteredTasks.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredTasks.map((task) => {
              const isEnabled = task.enabled !== false
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-150 hover:bg-white/[0.04] group select-none"
                >
                  {/* Left Side : Name + Schedule string */}
                  <div className="flex flex-col min-w-0 pr-4">
                    <span
                      className="truncate text-[#eceee9] font-normal"
                      style={{ fontSize: '14px', lineHeight: '1.4' }}
                    >
                      {task.name}
                    </span>
                    <span
                      className="text-[#7a7c78] font-normal"
                      style={{ fontSize: '12.5px', lineHeight: '1.4' }}
                    >
                      {task.frequency} around {task.time}
                    </span>
                  </div>

                  {/* Right Side : 3 dots options + Toggle switch */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* 3 dots button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenOptionsId((prev) => (prev === task.id ? null : task.id))
                        }}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          openOptionsId === task.id
                            ? 'bg-white/10 text-white'
                            : 'text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-white/5'
                        }`}
                        data-tooltip={openOptionsId === task.id ? undefined : 'More options'}
                        data-tooltip-side="top"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.75" />
                          <circle cx="12" cy="12" r="1.75" />
                          <circle cx="12" cy="19" r="1.75" />
                        </svg>
                      </button>

                      <ScheduledTaskOptionsMenu
                        isOpen={openOptionsId === task.id}
                        onClose={() => setOpenOptionsId(null)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    </div>

                    {/* Pink / Magenta Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => handleToggleTask(task.id)}
                      className="relative inline-flex items-center flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none"
                      style={{
                        width: '38px',
                        height: '22px',
                        backgroundColor: isEnabled ? '#e91e63' : 'rgba(255, 255, 255, 0.16)',
                        padding: '2px'
                      }}
                    >
                      <span
                        className="pointer-events-none inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out"
                        style={{
                          width: '18px',
                          height: '18px',
                          transform: isEnabled ? 'translateX(16px)' : 'translateX(0px)'
                        }}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full mt-24">
            <span style={{ fontSize: '14px', color: '#6f716c', fontWeight: 400 }}>
              No scheduled tasks configured.
            </span>
          </div>
        )}
      </div>

      {/* Modal Dialog New Scheduled Task */}
      <NewScheduledTaskModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        projects={projects}
        onAddTask={handleAddTask}
      />
    </div>
  )
}

