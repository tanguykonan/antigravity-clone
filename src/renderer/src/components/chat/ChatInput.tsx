import React, { useState, useRef } from 'react'
import { Plus, ChevronDown, Mic, ArrowRight, Folder } from 'lucide-react'
import { Project } from '../layout/Sidebar'
import { ProjectSelectorDropdown } from './ProjectSelectorDropdown'
import { ModelSelectorDropdown } from './ModelSelectorDropdown'
import { ProviderModelTier } from '../../services/llm/types'
import { llmManager } from '../../services/llm/LLMManager'

interface ChatInputProps {
  projectName: string | null
  projects?: Project[]
  selectedProjectId?: string
  onSelectProject?: (id: string) => void
  onCreateProject?: () => void
  hasActiveConversation?: boolean
  selectedModelId?: string
  onSelectModel?: (id: string) => void
}

export const ChatInput: React.FC<ChatInputProps> = ({
  projectName = 'desktop-llm',
  projects = [],
  selectedProjectId = 'desktop-llm',
  onSelectProject = () => {},
  onCreateProject,
  hasActiveConversation = false,
  selectedModelId: externalModelId,
  onSelectModel: externalOnSelectModel
}) => {
  const [value, setValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [internalModelId, setInternalModelId] = useState('claude-sonnet-medium')
  const [selectedModel, setSelectedModel] = useState<ProviderModelTier | null>(
    () => llmManager.getActiveProvider().models.find((m) => m.id === 'claude-sonnet-medium') || llmManager.getActiveProvider().models[0]
  )
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const modelButtonRef = useRef<HTMLButtonElement>(null)

  const selectedModelId = externalModelId ?? internalModelId
  const handleSelectModel = (id: string, model: ProviderModelTier) => {
    setInternalModelId(id)
    setSelectedModel(model)
    llmManager.setActiveProvider(model.providerId)
    llmManager.setActiveTierId(model.id)
    externalOnSelectModel?.(id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const currentProjectName = projectName || 'desktop-llm'

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-8 pb-12">
      <div className="w-full max-w-2xl flex flex-col gap-2.5">
        {/* ── Project dropdown au-dessus de la carte (style macOS pill) ── */}
        <div className="relative flex items-center gap-1.5 pl-1 select-none z-30">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all cursor-pointer group ${
              isDropdownOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5'
            }`}
          >
            <Folder
              size={14}
              strokeWidth={1.6}
              className={`transition-colors ${
                isDropdownOpen ? 'text-white' : 'text-[#8a8c87] group-hover:text-[#c5c7c2]'
              }`}
            />
            <span
              style={{ fontSize: '13px', color: isDropdownOpen ? '#ffffff' : '#c5c7c2', fontWeight: 500 }}
              className="group-hover:text-white transition-colors"
            >
              {currentProjectName}
            </span>
            <ChevronDown
              size={12}
              className={`text-[#7a7c78] group-hover:text-[#c5c7c2] transition-transform duration-150 ${
                isDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Bulle Dropdown de sélection de projet */}
          <ProjectSelectorDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            onCreateProject={onCreateProject}
          />
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
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-[#8a8c87] hover:text-white transition-all cursor-pointer active:scale-95"
                  data-tooltip="Attach file or context"
                  data-tooltip-side="top"
                >
                  <Plus size={15} strokeWidth={2} />
                </button>

                {/* Sélecteur de modèle épuré & transparent de base */}
                <div className="relative">
                  <button
                    ref={modelButtonRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsModelMenuOpen((prev) => !prev)
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all cursor-pointer group select-none ${
                      isModelMenuOpen
                        ? 'bg-white/10 text-white'
                        : 'text-[#7a7c78] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 400 }}>
                      {selectedModel ? selectedModel.name : 'Claude 3.7 Sonnet (Thinking)'}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`text-[#8a8c87] group-hover:text-white transition-transform duration-150 ${
                        isModelMenuOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>

                  <ModelSelectorDropdown
                    isOpen={isModelMenuOpen}
                    onClose={() => setIsModelMenuOpen(false)}
                    anchorRef={modelButtonRef}
                    selectedModelId={selectedModelId}
                    onSelectModel={handleSelectModel}
                  />
                </div>
              </div>

              {/* Droite : icône micro et bouton rond envoyer */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-[#8a8c87] hover:text-white transition-all cursor-pointer active:scale-95"
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
                  data-tooltip-side="top"
                >
                  <ArrowRight size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Ligne inférieure : Local dropdown discret et classe (style minimaliste macOS) */}
            {!hasActiveConversation && (
              <div className="px-4 pb-2.5 pt-0 flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[#7a7c78] hover:text-[#c5c7c2] hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  {/* Icône Laptop vectorielle épurée */}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#7a7c78] group-hover:text-[#c5c7c2] transition-colors"
                  >
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 400 }} className="leading-none">
                    Local
                  </span>
                  <ChevronDown
                    size={11}
                    className="text-[#656762] group-hover:text-[#c5c7c2] transition-colors opacity-80"
                  />
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
