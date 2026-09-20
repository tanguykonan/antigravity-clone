import React, { useState, useRef } from 'react'
import { Plus, ChevronDown, Mic, ArrowRight, Folder, Monitor } from 'lucide-react'

interface ChatInputProps {
  projectName: string | null
}

export const ChatInput: React.FC<ChatInputProps> = ({ projectName }) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-8">
      <div className="w-full max-w-2xl flex flex-col gap-2">

        {/* Project breadcrumb */}
        {projectName && (
          <div className="flex items-center gap-1.5 mb-1">
            <Folder size={12} className="text-text-muted" />
            <span className="text-sm text-text-secondary">{projectName}</span>
            <ChevronDown size={12} className="text-text-muted" />
          </div>
        )}

        {/* Input card — compact, une seule zone unifiée */}
        <form onSubmit={handleSubmit}>
          <div className="bg-bg-elevated border border-bg-border rounded-xl">
            {/* Textarea */}
            <div className="px-4 pt-3 pb-1">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask anything, @ to mention, / for actions"
                rows={1}
                className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted outline-none resize-none leading-6"
                style={{ minHeight: '24px', maxHeight: '160px' }}
              />
            </div>

            {/* Toolbar: model selector à gauche, actions à droite, Local en bas-gauche */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              {/* Left: + button + model selector + Local */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
                >
                  <Plus size={13} />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-accent-DEFAULT hover:bg-accent-bg transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-DEFAULT flex-shrink-0" />
                  <span className="font-medium">Claude Sonnet 4.6</span>
                  <span className="text-text-muted">(Thinking)</span>
                  <ChevronDown size={10} className="text-text-muted" />
                </button>

                <div className="w-px h-3 bg-bg-border mx-1" />

                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Monitor size={11} />
                  <span>Local</span>
                  <ChevronDown size={10} />
                </button>
              </div>

              {/* Right: mic + send */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
                >
                  <Mic size={13} />
                </button>
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="w-6 h-6 flex items-center justify-center rounded bg-bg-hover text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
