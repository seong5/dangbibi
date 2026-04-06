import { useState } from 'react'
import { format, parseISO, eachDayOfInterval } from 'date-fns'
import { ko } from 'date-fns/locale'
import { saveShiftOverride, deleteShiftOverride, getShiftOverride } from '@/entities/shift'
import { SHIFT_STYLES } from '@/shared/config/shiftPatterns'
import type { OverrideType } from '@/shared/config/shiftPatterns'
import { formatDate } from '@/shared/lib/date'

const OVERRIDE_OPTIONS: OverrideType[] = ['연차', '반차(오전)', '반차(오후)', '병가', '특근']

interface OverrideModalProps {
  date: string
  onClose: () => void
  onSaved: () => void
}

export function OverrideModal({ date, onClose, onSaved }: OverrideModalProps) {
  const existing = getShiftOverride(date)
  const [selected, setSelected] = useState<OverrideType | null>(existing?.overrideType ?? null)
  const [memo, setMemo] = useState(existing?.memo ?? '')
  const [startDate, setStartDate] = useState(date)
  const [endDate, setEndDate] = useState(date)

  const isRangeType = selected === '연차'
  const dateLabel = format(parseISO(date), 'M월 d일 (E)', { locale: ko })

  function handleSave() {
    if (!selected) return

    if (isRangeType) {
      // 범위 내 모든 날짜에 저장
      const days = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate < startDate ? startDate : endDate),
      })
      days.forEach((day) => {
        saveShiftOverride({
          date: formatDate(day),
          overrideType: selected,
          memo: memo || undefined,
        })
      })
    } else {
      saveShiftOverride({ date, overrideType: selected, memo: memo || undefined })
    }

    onSaved()
    onClose()
  }

  function handleDelete() {
    deleteShiftOverride(date)
    onSaved()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white px-5 pb-6 pt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-base font-bold text-gray-900">{dateLabel}</p>

        {/* 타입 선택 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {OVERRIDE_OPTIONS.map((type) => {
            const style = SHIFT_STYLES[type]
            const isActive = selected === type
            return (
              <button
                key={type}
                onClick={() => setSelected(isActive ? null : type)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-2 transition-all ${
                  isActive
                    ? `${style.color} ${style.textColor} ring-gray-900`
                    : 'bg-gray-100 text-gray-800 ring-transparent'
                }`}
              >
                {style.label}
              </button>
            )
          })}
        </div>

        {/* 연차 날짜 범위 */}
        {isRangeType && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none"
              />
            </div>
            <span className="mt-5 text-gray-600">–</span>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">종료일</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none"
              />
            </div>
          </div>
        )}

        {/* 메모 */}
        <input
          type="text"
          placeholder="메모 (선택)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="mb-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none"
        />

        {/* 버튼 */}
        <div className="flex gap-2">
          {existing && (
            <button
              onClick={handleDelete}
              className="flex-1 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-700 active:bg-red-100"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!selected}
            className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500 active:bg-gray-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
