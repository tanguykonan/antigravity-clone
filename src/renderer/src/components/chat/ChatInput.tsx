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
        {/* ── Project dropdown au-dessus de la carte (style macOS pill) ── */}
        <div className="flex items-center gap-1.5 pl-1 select-none">
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
          >
            <Folder size={14} strokeWidth={1.6} className="text-[#8a8c87] group-hover:text-[#c5c7c2] transition-colors" />
            <span style={{ fontSize: '13px', color: '#c5c7c2', fontWeight: 500 }} className="group-hover:text-white transition-colors">
              {projectName || 'desktop-llm'}
            </span>
            <ChevronDown size={12} className="text-[#7a7c78] group-hover:text-[#c5c7c2] transition-colors" />
          </button>
        </div>

        {/* ── Carte de saisie principale (macOS Frosted Glass & Inner Highlight) ── */}
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className="rounded-2xl transition-all duration-200 backdrop-blur-2xl focus-within:border-[#007aff]/60 focus-within:shadow-[0_20px_50px_-10px_rgba(0,122,255,0.18)]"
            style={{
              backgroundColor: 'rgba(38, 41, 36, 0.78)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
            }}
          >
            {/* Zone de saisie / Textarea */}
            <div className="px-5 pt-4 pb-2">
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
                className="w-full bg-transparent outline-none resize-none leading-relaxed placeholder-[#7a7c78]"
                style={{
                  minHeight: '28px',
                  maxHeight: '180px',
                  fontSize: '14.5px',
                  color: '#ffffff',
                  fontWeight: 400
                }}
              />
            </div>

            {/* Ligne des contrôles : + | Modèle | Micro | Flèche envoyer */}
            <div className="flex items-center justify-between px-4 pb-2.5">
              {/* Gauche : bouton + et sélecteur de modèle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#8a8c87] hover:text-white transition-all cursor-pointer active:scale-95"
                  data-tooltip="Attach file or context"
                  data-tooltip-side="top"
                >
                  <Plus size={15} strokeWidth={2} />
                </button>

                {/* Sélecteur de modèle : Gemini 3.8 Flash Medium */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer active:scale-98"
                >
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#f0f0ee' }}>
                    Gemini 3.8 Flash Medium
                  </span>
                  <ChevronDown size={12} className="text-[#8a8c87]" />
                </button>
              </div>

              {/* Droite : icône micro et bouton rond envoyer */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#8a8c87] hover:text-white transition-all cursor-pointer active:scale-95"
                  data-tooltip="Voice input"
                  data-tooltip-side="top"
                >
                  <Mic size={15} />
                </button>

                {/* Bouton d'envoi circulaire style macOS */}
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    value.trim()
                      ? 'bg-[#007aff] hover:bg-[#0071eb] text-white shadow-[0_2px_10px_rgba(0,122,255,0.45)]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  data-tooltip="Send message"
                  data-tooltip-shortcut="Enter"
                  data-tooltip-side="top"
                >
                  <ArrowRight size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Ligne inférieure : Local dropdown */}
            <div className="px-4 pb-3 pt-0.5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/10 border border-white/5 text-[#8a8c87] hover:text-white transition-all cursor-pointer"
              >
                <Monitor size={12} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Local</span>
                <ChevronDown size={11} className="opacity-70" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
