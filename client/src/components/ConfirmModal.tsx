import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
  show: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  show,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Handle Escape key
  useEffect(() => {
    if (!show) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [show, onCancel])

  if (!show) return null

  const iconMap = {
    danger: { icon: 'bi-exclamation-triangle-fill', color: 'text-danger' },
    warning: { icon: 'bi-exclamation-circle-fill', color: 'text-warning' },
    primary: { icon: 'bi-info-circle-fill', color: 'text-primary' },
  }
  const { icon, color } = iconMap[variant]

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4">
            <div className="modal-header border-0 pb-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${icon} ${color} fs-4`} />
                <h5 className="modal-title fw-bold mb-0">{title}</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
              />
            </div>
            <div className="modal-body px-4 py-3">
              <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-line' }}>
                {message}
              </p>
            </div>
            <div className="modal-footer border-0 pt-0 pb-4 px-4 gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-3"
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn btn-${variant} rounded-3`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
