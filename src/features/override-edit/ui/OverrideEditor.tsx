import { useState } from 'react'
import { format, parseISO, eachDayOfInterval } from 'date-fns'
import { ko } from 'date-fns/locale'
import { saveShiftOverride, deleteShiftOverride, getShiftOverride } from '@/entities/shift'
import { SHIFT_STYLES } from '@/shared/config/shiftPatterns'
import type { OverrideType } from '@/shared/config/shiftPatterns'
import { formatDate } from '@/shared/lib/date'

const OVERRIDE_OPTIONS: OverrideType[] = ['연차', '반차(오전)', '반차(오후)', '병가', '특근']

export interface OverrideEditorProps {
  date: string
  onSaved: () => void
  /** 인라인 등에서 닫기·취소 시 호출 */
  onCancel?: () => void
  /** 모달에서 상단 날짜 제목 표시 */
  showDateHeading?: boolean
}

export function OverrideEditor({ date, onSaved, onCancel, showDateHeading = true }: OverrideEditorProps) {
  const existing = getShiftOverride(date)
  /** `date`가 바뀌면 부모가 `key={date}`로 remount — effect 없이 초기값 동기화 (React 19 권장) */
  const [selected, setSelected] = useState<OverrideType | null>(() => getShiftOverride(date)?.overrideType ?? null)
  const [memo, setMemo] = useState(() => getShiftOverride(date)?.memo ?? '')
  const [startDate, setStartDate] = useState(() => date)
  const [endDate, setEndDate] = useState(() => date)

  const isRangeType = selected === '연차'
  const dateLabel = format(parseISO(date), 'M월 d일 (E)', { locale: ko })

  function handleSave() {
    if (!selected) return

    if (isRangeType) {
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
  }

  function handleDelete() {
    deleteShiftOverride(date)
    onSaved()
  }

  return (
    <div>
      {showDateHeading ? (
        <p className="mb-4 text-base font-bold text-gray-900">{dateLabel}</p>
      ) : (
        <p className="mb-3 text-sm font-semibold text-gray-900">휴가·특근 등 일정</p>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {OVERRIDE_OPTIONS.map((type) => {
          const shiftStyle = SHIFT_STYLES[type]
          const isActive = selected === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelected(isActive ? null : type)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-2 transition-all ${
                isActive
                  ? `${shiftStyle.color} ${shiftStyle.textColor} ring-gray-900`
                  : 'bg-gray-100 text-gray-800 ring-transparent'
              }`}
            >
              {shiftStyle.label}
            </button>
          )
        })}
      </div>

      {isRangeType && (
        <div className="mb-3 flex items-center gap-2">
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

      <input
        type="text"
        placeholder="메모 (선택)"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            취소
          </button>
        )}
        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 active:bg-red-100"
          >
            삭제
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!selected}
          className="min-w-0 flex-1 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500 active:bg-gray-700"
        >
          저장
        </button>
      </div>
    </div>
  )
}
