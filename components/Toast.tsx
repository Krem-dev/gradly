'use client'

import { useToast } from '@/context/ToastContext'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          Icon: CheckCircle
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          Icon: AlertCircle
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          Icon: AlertTriangle
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          Icon: Info
        }
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map(toast => {
        const styles = getStyles(toast.type)
        const { Icon } = styles

        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex items-start gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
          >
            <Icon className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
            <p className={`${styles.text} text-sm font-medium flex-1`}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${styles.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
