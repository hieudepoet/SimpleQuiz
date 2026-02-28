import { useState, useCallback, useRef } from 'react'

interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'primary'
}

interface ConfirmState extends ConfirmOptions {
  show: boolean
}

/**
 * Hook to replace window.confirm with a styled React modal.
 *
 * Usage:
 *   const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm()
 *
 *   // In handler:
 *   const ok = await confirm({ message: 'Are you sure?' })
 *   if (!ok) return
 *
 *   // In JSX:
 *   <ConfirmModal {...confirmState} onConfirm={handleConfirm} onCancel={handleCancel} />
 */
export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    show: false,
    message: '',
  })

  const resolveRef = useRef<(value: boolean) => void>(() => {})

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setConfirmState({ ...options, show: true })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setConfirmState((s) => ({ ...s, show: false }))
    resolveRef.current(true)
  }, [])

  const handleCancel = useCallback(() => {
    setConfirmState((s) => ({ ...s, show: false }))
    resolveRef.current(false)
  }, [])

  return { confirmState, confirm, handleConfirm, handleCancel }
}
