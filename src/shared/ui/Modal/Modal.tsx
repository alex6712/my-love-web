import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-rose-400 transition-colors hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/30"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
