import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronRight, ChevronLeft, Search } from 'lucide-react'
import { LLMProviderId, ProviderModelTier } from '../../services/llm/types'
import { llmManager } from '../../services/llm/LLMManager'

interface ModelSelectorDropdownProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  selectedModelId: string
  onSelectModel: (id: string, model: ProviderModelTier) => void
}

// ── Icônes vectorielles SVG minimalistes & sur-mesure pour chaque provider ──
const ProviderIcon: React.FC<{ id: LLMProviderId; className?: string }> = ({ id, className = 'w-3.5 h-3.5' }) => {
  switch (id) {
    case 'ollama':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="7 8 10 10 7 12" />
          <line x1="12" y1="12" x2="15" y2="12" />
        </svg>
      )
    case 'gemini':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
        </svg>
      )
    case 'anthropic':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.5 4L20.5 20H16.2L14.9 16.3H9.1L7.8 20H3.5L9.5 4H14.5ZM13.8 12.8L12 7.6L10.2 12.8H13.8Z" />
        </svg>
      )
    case 'openai':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 10.2a5.4 5.4 0 0 0-.4-4.2 5.5 5.5 0 0 0-5.1-2.8 5.7 5.7 0 0 0-1.7.3A5.4 5.4 0 0 0 8.8 2a5.5 5.5 0 0 0-5.2 3.8 5.4 5.4 0 0 0-2.3 3.6 5.5 5.5 0 0 0 .9 5.8 5.4 5.4 0 0 0 .4 4.2 5.5 5.5 0 0 0 5.1 2.8 5.7 5.7 0 0 0 1.7-.3 5.4 5.4 0 0 0 4.5 1.5 5.5 5.5 0 0 0 5.2-3.8 5.4 5.4 0 0 0 2.3-3.6 5.5 5.5 0 0 0-.9-5.8zm-7.6 10.3a4.2 4.2 0 0 1-2.6-.9l.1-.1 4.3-2.5a.7.7 0 0 0 .3-.6v-6l1.8 1v5a4.2 4.2 0 0 1-3.9 4.1zm-8.8-3.8a4.2 4.2 0 0 1-.5-2.7l.1.1 4.3 2.5a.7.7 0 0 0 .7 0l5.2-3v2.1l-4.4 2.5a4.2 4.2 0 0 1-5.4-1.5zm-1.2-8.4a4.2 4.2 0 0 1 2.1-1.8v5.1a.7.7 0 0 0 .3.6l5.2 3-1.8 1-4.4-2.5a4.2 4.2 0 0 1-1.4-5.4zm13.3 2.8l-5.2-3 1.8-1 4.4 2.5a4.2 4.2 0 0 1 1.4 5.4 4.2 4.2 0 0 1-2.1 1.8v-5.1a.7.7 0 0 0-.3-.6zm2.4-2.6a4.2 4.2 0 0 1 .5 2.7l-.1-.1-4.3-2.5a.7.7 0 0 0-.7 0l-5.2 3v-2.1l4.4-2.5a4.2 4.2 0 0 1 5.4 1.5zm-8.6-3.8a4.2 4.2 0 0 1 2.6.9l-.1.1-4.3 2.5a.7.7 0 0 0-.3.6v6l-1.8-1v-5a4.2 4.2 0 0 1 3.9-4.1zm.9 6.2l2.3 1.3v2.7l-2.3 1.3-2.3-1.3v-2.7l2.3-1.3z" />
        </svg>
      )
    case 'mistral':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="15" width="4" height="6" rx="1" />
          <rect x="10" y="9" width="4" height="12" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      )
  }
}

export const ModelSelectorDropdown: React.FC<ModelSelectorDropdownProps> = ({
  isOpen,
  onClose,
  anchorRef,
  selectedModelId,
  onSelectModel
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeSubProviderId, setActiveSubProviderId] = useState<LLMProviderId | null>(null)
  const [subModels, setSubModels] = useState<ProviderModelTier[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [position, setPosition] = useState<{
    top: number
    left: number
    maxHeight: number
    placement: 'top' | 'bottom'
  } | null>(null)

  const localProviders = llmManager.getLocalProviders()
  const cloudProviders = llmManager.getCloudProviders()

  const handleOpenProviderSubmenu = async (providerId: LLMProviderId) => {
    setActiveSubProviderId(providerId)
    setSearchQuery('')
    const models = await llmManager.getModelsForProvider(providerId)
    setSubModels(models)
  }

  const handleBackToProviders = () => {
    setActiveSubProviderId(null)
    setSubModels([])
    setSearchQuery('')
  }

  // ── Moteur de calcul de positionnement intelligent avec détection de l'espace haut / bas ──
  const calculateSmartPosition = useCallback(() => {
    if (!anchorRef.current) return

    const anchorRect = anchorRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const menuWidth = 260

    // Espace disponible réel au-dessus et en-dessous de l'élément déclencheur
    const spaceAbove = anchorRect.top - 8
    const spaceBelow = viewportHeight - anchorRect.bottom - 8

    // Hauteur de contenu estimée ou mesurée
    const menuEl = menuRef.current
    const menuHeight = menuEl && menuEl.offsetHeight > 50 ? menuEl.offsetHeight : 230
    const requiredSpace = menuHeight + 10

    let top: number
    let maxHeight: number
    let placement: 'top' | 'bottom'

    // ── Décision de positionnement naturel & intelligente ──
    // 1. Si l'espace en bas est suffisant -> ouvrir vers le BAS (naturel)
    // 2. Si l'espace en bas est insuffisant mais que l'espace en haut suffit -> FLIP vers le HAUT
    // 3. Si les deux sont restreints -> choisir le côté ayant le plus d'espace
    if (spaceBelow >= requiredSpace) {
      placement = 'bottom'
      maxHeight = Math.min(spaceBelow - 6, 380)
      top = anchorRect.bottom + 6
    } else if (spaceAbove >= requiredSpace) {
      placement = 'top'
      maxHeight = Math.min(spaceAbove - 6, 380)
      const targetHeight = Math.min(menuHeight, maxHeight)
      top = anchorRect.top - targetHeight - 6
    } else {
      if (spaceBelow >= spaceAbove) {
        placement = 'bottom'
        maxHeight = Math.max(120, spaceBelow - 6)
        top = anchorRect.bottom + 6
      } else {
        placement = 'top'
        maxHeight = Math.max(120, spaceAbove - 6)
        top = anchorRect.top - maxHeight - 6
      }
    }

    // Clamp de sécurité pour garantir qu'aucun pixel ne sort de la fenêtre
    top = Math.max(8, Math.min(viewportHeight - maxHeight - 8, top))

    // Positionnement horizontal avec alignement naturel et clamp bord d'écran
    let left = anchorRect.left
    if (left + menuWidth > viewportWidth - 10) {
      left = viewportWidth - menuWidth - 10
    }
    left = Math.max(10, left)

    setPosition({ top, left, maxHeight, placement })
  }, [anchorRef])

  useLayoutEffect(() => {
    if (isOpen) {
      calculateSmartPosition()
    } else {
      setPosition(null)
      setActiveSubProviderId(null)
    }
  }, [isOpen, calculateSmartPosition, activeSubProviderId, subModels])

  useEffect(() => {
    if (!isOpen) return

    const handleWindowChange = () => {
      calculateSmartPosition()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSubProviderId) {
          handleBackToProviders()
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('scroll', handleWindowChange, true)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('scroll', handleWindowChange, true)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, anchorRef, activeSubProviderId, calculateSmartPosition])

  if (!isOpen || typeof document === 'undefined') return null

  const activeProvider = activeSubProviderId ? llmManager.getProvider(activeSubProviderId) : null

  const filteredSubModels = subModels.filter((m) =>
    searchQuery ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return createPortal(
    <div
      ref={menuRef}
      className="fixed select-none z-[99999] animate-in fade-in zoom-in-95 duration-100 flex flex-col"
      style={{
        width: '260px',
        top: position ? `${position.top}px` : '-9999px',
        left: position ? `${position.left}px` : '-9999px',
        maxHeight: position ? `${position.maxHeight}px` : '380px',
        backgroundColor: '#222420',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow:
          '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        borderRadius: '12px',
        padding: '4px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── NIVEAU 1 : LISTE DES PROVIDERS (LOCAL vs CLOUD) ── */}
      {!activeSubProviderId ? (
        <div className="flex flex-col space-y-0.5">
          {/* Section 1 : LOCAL */}
          <div className="px-2 pt-1 pb-0.5 text-[10.5px] font-medium text-[#7a7c78]">
            Local
          </div>
          <div className="space-y-0.5">
            {localProviders.map((provider) => {
              const isActive = llmManager.getActiveProvider().id === provider.id
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleOpenProviderSubmenu(provider.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer group"
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? '#ffffff' : '#dcded9',
                    fontSize: '12.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0">
                      <ProviderIcon id={provider.id} />
                    </span>
                    <span className="truncate group-hover:text-white">
                      {provider.name}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#7a7c78] group-hover:text-white transition-colors flex-shrink-0" />
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-white/[0.08]" />

          {/* Section 2 : CLOUD PROVIDERS */}
          <div className="px-2 pt-0.5 pb-0.5 text-[10.5px] font-medium text-[#7a7c78]">
            Cloud Providers
          </div>
          <div className="space-y-0.5">
            {cloudProviders.map((provider) => {
              const isActive = llmManager.getActiveProvider().id === provider.id
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleOpenProviderSubmenu(provider.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer group"
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? '#ffffff' : '#dcded9',
                    fontSize: '12.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#a0a29c] group-hover:text-white transition-colors flex-shrink-0">
                      <ProviderIcon id={provider.id} />
                    </span>
                    <span className="truncate group-hover:text-white">
                      {provider.name}
                    </span>
                  </div>
                  <ChevronRight size={13} className="text-[#7a7c78] group-hover:text-white transition-colors flex-shrink-0" />
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* ── NIVEAU 2 : MODÈLES DU PROVIDER CHOISI (Sous-menu Drill-down) ── */
        <div className="flex flex-col space-y-0.5 animate-in fade-in slide-in-from-right-1 duration-150">
          {/* Header avec bouton Retour */}
          <div className="flex items-center justify-between px-1 pt-0.5 pb-1 border-b border-white/[0.08] mb-0.5">
            <button
              type="button"
              onClick={handleBackToProviders}
              className="flex items-center gap-1.5 px-1.5 py-1 rounded-md text-xs text-[#8a8c87] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft size={13.5} />
              <div className="flex items-center gap-1.5">
                <ProviderIcon id={activeProvider!.id} className="w-3.5 h-3.5 text-white" />
                <span className="font-medium text-[12.5px] text-white">{activeProvider?.name}</span>
              </div>
            </button>
          </div>

          {/* Recherche si beaucoup de modèles (ex: Ollama avec 50+ modèles) */}
          {subModels.length > 5 && (
            <div className="px-1 mb-1">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/5">
                <Search size={12} className="text-[#7a7c78]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models..."
                  className="w-full bg-transparent outline-none text-xs text-white placeholder-[#7a7c78]"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Liste des modèles */}
          <div className="space-y-0.5 overflow-y-auto menu-scrollbar flex-1 pr-0.5" style={{ maxHeight: '280px' }}>
            {filteredSubModels.map((model) => {
              const isSelected = model.id === selectedModelId

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id, model)
                    onClose()
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer group"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isSelected ? '#ffffff' : '#dcded9',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 500 : 400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span className="truncate">{model.name}</span>
                  {isSelected && (
                    <Check size={13} className="text-white flex-shrink-0 ml-2" strokeWidth={2.2} />
                  )}
                </button>
              )
            })}

            {filteredSubModels.length === 0 && (
              <div className="py-4 text-center text-xs text-[#6f716c]">
                No models available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}
