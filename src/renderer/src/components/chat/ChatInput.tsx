import React, { useState, useRef } from 'react'
import { Plus, ChevronDown, Mic, ArrowRight, Folder, Monitor } from 'lucide-react'

interface ChatInputProps {
  projectName: string | null
}

export const ChatInput: React.FC<ChatInputProps> = ({ projectName = 'desktop-llm' }) => {
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
    <div className="flex flex-col items-center justify-center h-full w-full px-8 pb-12">
      <div className="w-full max-w-2xl flex flex-col gap-2.5">

        {/* ── Project dropdown au-dessus de la carte ── */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer select-none">
          <Folder size={15} strokeWidth={1.5} style={{ color: '#8a8c87' }} />
          <span style={{ fontSize: '14px', color: '#a8aaa4', fontWeight: 400 }}>
            {projectName || 'desktop-llm'}
          </span>
          <ChevronDown size={13} style={{ color: '#7a7c78' }} />
        </div>

        {/* ── Carte de saisie principale ── */}
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="rounded-2xl transition-all"
            style={{
              backgroundColor: '#272925',
              border: '1px solid #32342f'
            }}
          >
            {/* Zone de saisie / Textarea */}
            <div className="px-4 pt-4 pb-2">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Ask anything, @ to mention, / for actions"
                rows={1}
                className="w-full bg-transparent outline-none resize-none leading-relaxed"
                style={{
                  minHeight: '26px',
                  maxHeight: '180px',
                  fontSize: '14.5px',
                  color: '#eceee9'
                }}
              />
            </div>

            {/* Ligne des contrôles : + | Modèle | Micro | Flèche envoyer */}
            <div className="flex items-center justify-between px-3.5 pb-2.5">
              {/* Gauche : bouton + et sélecteur de modèle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors cursor-pointer"
                  style={{ color: '#8a8c87' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#eceee9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8c87')}
                  title="Attach file or context"
                >
                  <Plus size={16} />
                </button>

                {/* Sélecteur de modèle : Gemini 3.8 Flash Medium */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  style={{ color: '#eceee9' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#30322d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 400, color: '#eceee9' }}>
                    Gemini 3.8 Flash Medium
                  </span>
                  <ChevronDown size={13} style={{ color: '#8a8c87' }} />
                </button>
              </div>

              {/* Droite : icône micro et bouton rond envoyer */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer"
                  style={{ color: '#8a8c87' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#eceee9')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8a8c87')}
                  title="Voice input"
                >
                  <Mic size={15} />
                </button>

                {/* Bouton rond d'envoi */}
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{
                    backgroundColor: value.trim() ? '#444741' : '#343632',
                    color: value.trim() ? '#eceee9' : '#686a65'
                  }}
                  title="Send message"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Ligne inférieure : Local dropdown */}
            <div className="px-4 pb-3 pt-0.5">
              <button
                type="button"
                className="flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{ color: '#7a7c78' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a8aaa4')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7c78')}
              >
                <Monitor size={13} />
                <span style={{ fontSize: '12.5px' }}>Local</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
