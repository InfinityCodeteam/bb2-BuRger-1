import { useToast } from '../../context/ToastContext'

export default function Toast() {
  const { toast } = useToast()
  if (!toast.visible) return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-dcard border border-dborder text-dtext px-5 py-3 rounded-xl shadow-2xl shadow-black/60 text-sm font-semibold animate-fade-in-up flex items-center gap-2 whitespace-nowrap">
      <span className="text-brand">✓</span>
      {toast.message}
    </div>
  )
}
