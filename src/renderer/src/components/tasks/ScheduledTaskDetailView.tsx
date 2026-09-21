import React, { useState, useEffect } from 'react'
import { Folder, Pencil, ChevronLeft, ChevronDown, Check } from 'lucide-react'
import { ScheduledTask } from './NewScheduledTaskModal'
import { ScheduledTaskOptionsMenu } from './ScheduledTaskOptionsMenu'

interface ScheduledTaskDetailViewProps {
  task: ScheduledTask
  onBack: () => void
  onUpdateTask: (updated: ScheduledTask) => void
  onDeleteTask: (id: string) => void
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

export const ScheduledTaskDetailView: React.FC<ScheduledTaskDetailViewProps> = ({
  task,
  onBack,
  onUpdateTask,
  onDeleteTask
}) => {
  const [name, setName] = useState(task.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [prompt, setPrompt] = useState(task.prompt)
  const [frequency, setFrequency] = useState(task.frequency)
  const [time, setTime] = useState(task.time)
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false)
  const [savedFeedback, setSavedFeedback] = useState(false)

  useEffect(() => {
    setName(task.name)
    setPrompt(task.prompt)
    setFrequency(task.frequency)
    setTime(task.time)
  }, [task])

  const isDirty =
    name !== task.name ||
    prompt !== task.prompt ||
    frequency !== task.frequency ||
    time !== task.time

  const handleReset = () => {
    setName(task.name)
    setPrompt(task.prompt)
    setFrequency(task.frequency)
    setTime(task.time)
    setIsEditingName(false)
  }

  const handleSave = () => {
    onUpdateTask({
      ...task,
      name: name.trim() || task.name,
      prompt: prompt.trim(),
      frequency,
      time
    })
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 1500)
  }

  const isStopped = task.enabled === false

  return (
    <div
      className="flex flex-col h-full w-full bg-[#181a17] text-[#eceee9] overflow-y-auto select-none"
      onClick={() => {
        setIsFrequencyOpen(false)
        setIsTimeOpen(false)
        setIsOptionsMenuOpen(false)
      }}
    >
      <div className="w-full max-w-3xl mx-auto pt-10 px-6 pb-16 flex flex-col">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-[#8a8c87] hover:text-white transition-colors cursor-pointer mb-6 self-start group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Scheduled Tasks</span>
        </button>

        {/* ── Header : Title + Pencil + Project + 3 dots ── */}
        <div className="flex items-start justify-between w-full mb-6">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
            {/* Title with edit pencil */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false)
                  }}
                  autoFocus
                  className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-lg font-semibold text-white outline-none"
                  style={{ fontSize: '20px' }}
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="text-xl font-semibold text-white truncate cursor-pointer hover:text-[#dcded9] transition-colors"
                  style={{ fontSize: '20px', letterSpacing: '-0.01em' }}
                >
                  {name}
                </h1>
              )}

              <button
                type="button"
                onClick={() => setIsEditingName((prev) => !prev)}
                className="w-6 h-6 flex items-center justify-center rounded text-[#7a7c78] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                data-tooltip="Rename task"
                data-tooltip-side="top"
              >
                <Pencil size={13.5} />
              </button>
            </div>

            {/* Project Folder + Name */}
            <div className="flex items-center gap-1.5 text-xs text-[#8a8c87]">
              <Folder size={13} className="text-[#8a8c87]" strokeWidth={1.8} />
              <span style={{ fontSize: '13px' }}>{task.projectName}</span>
            </div>
          </div>

          {/* 3 dots More options */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsOptionsMenuOpen((prev) => !prev)
              }}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isOptionsMenuOpen ? 'bg-white/10 text-white' : 'text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-white/5'
              }`}
              data-tooltip={isOptionsMenuOpen ? undefined : 'More options'}
              data-tooltip-side="bottom"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="19" r="1.75" />
              </svg>
            </button>

            <ScheduledTaskOptionsMenu
              isOpen={isOptionsMenuOpen}
              onClose={() => setIsOptionsMenuOpen(false)}
              onDelete={() => {
                onDeleteTask(task.id)
                onBack()
              }}
            />
          </div>
        </div>

        {/* ── Card 1 : Status & Type (Exact matching layout) ── */}
        <div
          className="w-full rounded-2xl p-4 mb-6 flex flex-col space-y-3"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          {/* Status Row */}
          <div className="flex items-center justify-between text-xs">
            <span style={{ fontSize: '13px', color: '#8a8c87' }}>Status</span>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isStopped ? '#eab308' : '#22c55e',
                  boxShadow: isStopped ? '0 0 8px rgba(234, 179, 8, 0.6)' : '0 0 8px rgba(34, 197, 94, 0.6)'
                }}
              />
              <span style={{ fontSize: '13px', color: '#eceee9', fontWeight: 400 }}>
                {isStopped ? 'Stopped' : 'Active'}
              </span>
            </div>
          </div>

          {/* Type Row */}
          <div className="flex items-center justify-between text-xs">
            <span style={{ fontSize: '13px', color: '#8a8c87' }}>Type</span>
            <span style={{ fontSize: '13px', color: '#eceee9', fontWeight: 400 }}>
              Scheduled
            </span>
          </div>
        </div>

        {/* ── Card 2 : Prompt (Exact matching layout) ── */}
        <div className="flex flex-col mb-6">
          <label className="text-xs mb-2" style={{ fontSize: '13px', color: '#8a8c87' }}>
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-sm text-[#eceee9] placeholder-[#6f716c] outline-none focus:border-[#007aff]/50 transition-all resize-y min-h-[110px]"
            style={{ fontSize: '13.5px', lineHeight: '1.5' }}
          />
        </div>

        {/* ── Card 3 : Schedule (Exact matching layout) ── */}
        <div className="flex flex-col mb-8">
          <label className="text-xs mb-2" style={{ fontSize: '13px', color: '#8a8c87' }}>
            Schedule
          </label>
          <div
            className="w-full rounded-2xl p-3 flex items-center gap-2.5"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {/* Frequency Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFrequencyOpen((prev) => !prev)
                  setIsTimeOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-[#eceee9] transition-all cursor-pointer"
                style={{ height: '34px', fontSize: '13px' }}
              >
                <span>{frequency}</span>
                <ChevronDown size={13} className="text-[#7a7c78]" />
              </button>

              {isFrequencyOpen && (
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
                          setIsFrequencyOpen(false)
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
                  setIsTimeOpen((prev) => !prev)
                  setIsFrequencyOpen(false)
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-[#eceee9] transition-all cursor-pointer"
                style={{ height: '34px', fontSize: '13px' }}
              >
                <span>{time}</span>
                <ChevronDown size={13} className="text-[#7a7c78]" />
              </button>

              {isTimeOpen && (
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
                          setIsTimeOpen(false)
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

        {/* ── Save & Reset Buttons on bottom-left ── */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center min-w-[72px]"
            style={{
              backgroundColor: savedFeedback ? '#166534' : '#b32b5d',
              boxShadow: savedFeedback
                ? '0 4px 12px rgba(22, 101, 52, 0.35)'
                : '0 4px 12px rgba(179, 43, 93, 0.35)'
            }}
            onMouseEnter={(e) => {
              if (!savedFeedback) e.currentTarget.style.backgroundColor = '#c73369'
            }}
            onMouseLeave={(e) => {
              if (!savedFeedback) e.currentTarget.style.backgroundColor = '#b32b5d'
            }}
          >
            {savedFeedback ? 'Saved' : 'Save'}
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-[#a1a39d] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer active:scale-95 animate-in fade-in duration-150"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
