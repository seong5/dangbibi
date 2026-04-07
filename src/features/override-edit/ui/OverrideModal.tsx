import { OverrideEditor } from './OverrideEditor'

interface OverrideModalProps {
  date: string
  onClose: () => void
  onSaved: () => void
}

export function OverrideModal({ date, onClose, onSaved }: OverrideModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white px-5 pb-6 pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <OverrideEditor
          key={date}
          date={date}
          showDateHeading
          onSaved={() => {
            onSaved()
            onClose()
          }}
        />
      </div>
    </div>
  )
}
