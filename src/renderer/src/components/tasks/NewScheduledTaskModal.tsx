import React, { useState, useEffect, useRef } from 'react'
import { X, Folder, ChevronDown, Check } from 'lucide-react'
import { Project } from '../layout/Sidebar'

export interface ScheduledTask {
  id: string
  name: string
  projectId: string
  projectName: string
  frequency: string
  time: string
  prompt: string
  enabled?: boolean
  createdAt: number
}

interface NewScheduledTaskModalProps {
  isOpen: boolean
  onClose: () => void
  projects: Project[]
  onAddTask: (task: Omit<ScheduledTask, 'id' | 'createdAt'>) => void
}

const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Hourly', 'Weekdays', 'Weekends']
const TIME_OPTIONS = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM'
]

export const NewScheduledTaskModal: React.FC<NewScheduledTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  onAddTask
}) => {
  const [name, setName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'desktop-llm')
  const [frequency, setFrequency] = useState('Daily')
  const [time, setTime] = useState('9:00 AM')
  const [prompt, setPrompt] = useState('')

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)
  const [isFrequencyDropdownOpen, setIsFrequencyDropdownOpen] = useState(false)
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (projects.length > 0 && !projects.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(projects[0].id)
      }
    } else {
      setIsProjectDropdownOpen(false)
      setIsFrequencyDropdownOpen(false)
      setIsTimeDropdownOpen(false)
    }
  }, [isOpen, projects, selectedProjectId])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isProjectDropdownOpen || isFrequencyDropdownOpen || isTimeDropdownOpen) {
          setIsProjectDropdownOpen(false)
          setIsFrequencyDropdownOpen(false)
          setIsTimeDropdownOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isProjectDropdownOpen, isFrequencyDropdownOpen, isTimeDropdownOpen])

  if (!isOpen) return null

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddTask({
      name: name.trim(),
      projectId: selectedProject?.id || 'desktop-llm',
      projectName: selectedProject?.name || 'desktop-llm',
      frequency,
      time,
      prompt: prompt.trim()
    })

    // Reset form
    setName('')
    setPrompt('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)'
      }}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose()
        }
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-[540px] rounded-2xl p-6 flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-150"
        style={{
          backgroundColor: '#222420',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 8px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setIsProjectDropdownOpen(false)
          setIsFrequencyDropdownOpen(false)
          setIsTimeDropdownOpen(false)
        }}
      >
        {/* Header : Title + Close button */}
        <div className="flex items-center justify-between w-full mb-5">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
            New Scheduled Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[#7a7c78] hover:text-[#eceee9] hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Field 1: Name */}
          <div className="flex flex-col space-y-1.5">
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#dcded9' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter scheduled task name..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#eceee9] placeholder-[#6f716c] outline-none focus:border-[#007aff]/60 focus:bg-white/[0.06] transition-all"
              style={{ height: '38px', fontSize: '13.5px' }}
            />
          </div>

          {/* Field 2: Project selector */}
          <div className="flex flex-col space-y-1.5 relative">
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#dcded9' }}>
              Project
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsProjectDropdownOpen((prev) => !prev)
                  setIsFrequencyDropdownOpen(false)
                  setIsTimeDropdownOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-sm text-[#eceee9] transition-all cursor-pointer select-none"
                style={{ height: '38px' }}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder size={15} className="text-[#8a8c87] flex-shrink-0" strokeWidth={1.7} />
                  <span className="truncate" style={{ fontSize: '13.5px', color: '#ffffff' }}>
                    {selectedProject?.name || 'desktop-llm'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-[#7a7c78] flex-shrink-0" />
              </button>

              {/* Popover Dropdown list of available projects */}
              {isProjectDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-1.5 w-full max-h-48 overflow-y-auto rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 sidebar-scrollbar"
                  style={{
                    backgroundColor: '#1e201c',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.5)',
                    padding: '4px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-0.5">
                    {projects.map((proj) => {
                      const isSelected = proj.id === selectedProjectId
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(proj.id)
                            setIsProjectDropdownOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer group"
                          style={{
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            color: isSelected ? '#ffffff' : '#dcded9'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Folder size={14} className={isSelected ? 'text-[#007aff]' : 'text-[#8a8c87]'} />
                            <span className="truncate" style={{ fontSize: '13px' }}>
                              {proj.name}
                            </span>
                          </div>
                          {isSelected && <Check size={13} className="text-white flex-shrink-0 ml-2" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Field 3: Schedule (Frequency + around + Time) */}
          <div className="flex flex-col space-y-1.5">
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#dcded9' }}>
              Schedule
            </label>
            <div className="flex items-center gap-2">
              {/* Frequency Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsFrequencyDropdownOpen((prev) => !prev)
                    setIsProjectDropdownOpen(false)
                    setIsTimeDropdownOpen(false)
                  }}
                  className="flex items-center gap-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-[#eceee9] transition-all cursor-pointer"
                  style={{ height: '34px', fontSize: '13px' }}
                >
                  <span>{frequency}</span>
                  <ChevronDown size={13} className="text-[#7a7c78]" />
                </button>

                {isFrequencyDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-1.5 w-32 rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100"
                    style={{
                      backgroundColor: '#1e201c',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
                      padding: '4px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-0.5">
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFrequency(opt)
                            setIsFrequencyDropdownOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer"
                          style={{
                            backgroundColor: frequency === opt ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            color: frequency === opt ? '#ffffff' : '#dcded9'
                          }}
                        >
                          <span>{opt}</span>
                          {frequency === opt && <Check size={12} className="text-white ml-1.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Text "around" */}
              <span style={{ fontSize: '13px', color: '#7a7c78' }}>around</span>

              {/* Time Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsTimeDropdownOpen((prev) => !prev)
                    setIsProjectDropdownOpen(false)
                    setIsFrequencyDropdownOpen(false)
                  }}
                  className="flex items-center gap-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-[#eceee9] transition-all cursor-pointer"
                  style={{ height: '34px', fontSize: '13px' }}
                >
                  <span>{time}</span>
                  <ChevronDown size={13} className="text-[#7a7c78]" />
                </button>

                {isTimeDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-1.5 w-32 max-h-48 overflow-y-auto rounded-xl select-none z-50 animate-in fade-in zoom-in-95 duration-100 sidebar-scrollbar"
                    style={{
                      backgroundColor: '#1e201c',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
                      padding: '4px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-0.5">
                      {TIME_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setTime(opt)
                            setIsTimeDropdownOpen(false)
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer"
                          style={{
                            backgroundColor: time === opt ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            color: time === opt ? '#ffffff' : '#dcded9'
                          }}
                        >
                          <span>{opt}</span>
                          {time === opt && <Check size={12} className="text-white ml-1.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Field 4: Prompt */}
          <div className="flex flex-col space-y-1.5">
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#dcded9' }}>
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt for the agent to run..."
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#eceee9] placeholder-[#6f716c] outline-none focus:border-[#007aff]/60 focus:bg-white/[0.06] transition-all resize-y min-h-[110px]"
              style={{ fontSize: '13px', lineHeight: '1.5' }}
            />
            <span style={{ fontSize: '12px', color: '#7a7c78' }}>
              All scheduled tasks run as Flash.
            </span>
          </div>

          {/* Footer Submit Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#b32b5d',
                boxShadow: '0 4px 12px rgba(179, 43, 93, 0.35)'
              }}
              onMouseEnter={(e) => {
                if (name.trim()) e.currentTarget.style.backgroundColor = '#c73369'
              }}
              onMouseLeave={(e) => {
                if (name.trim()) e.currentTarget.style.backgroundColor = '#b32b5d'
              }}
            >
              Add Scheduled Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
