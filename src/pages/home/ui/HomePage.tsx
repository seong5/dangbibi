import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { getUserSetting } from '@/entities/user-setting'
import {
  clearAllShiftOverrides,
  getShiftForDate,
  getShiftOverride,
  hasAnyShiftOverride,
} from '@/entities/shift'
import { SHIFT_STYLES, JOB_TYPE_LABELS } from '@/shared/config/shiftPatterns'
import { today } from '@/shared/lib/date'
import { useMonthNavigation } from '@/features/shift-navigation'
import { OverrideEditor } from '@/features/override-edit'
import { MonthCalendar } from '@/widgets/month-calendar'

export function HomePage() {
  const setting = getUserSetting()!
  const todayStr = today()
  const { year, month, goNextMonth, goPrevMonth, goThisMonth } = useMonthNavigation()

  const [focusedDate, setFocusedDate] = useState(todayStr)
  const [showScheduleEditor, setShowScheduleEditor] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const shiftType = getShiftForDate(focusedDate, setting)
  const style = SHIFT_STYLES[shiftType]
  const focusedShort = format(parseISO(focusedDate), 'M/d')
  const isFocusedToday = focusedDate === todayStr
  const hasOverride = Boolean(getShiftOverride(focusedDate))

  function handleDayClick(date: string) {
    setFocusedDate(date)
  }

  function handleSaved() {
    setRefreshKey((k) => k + 1)
    setShowScheduleEditor(false)
  }

  function handleClearAllOverrides() {
    if (!hasAnyShiftOverride()) return
    const ok = window.confirm(
      '추가한 일정(연차·반차·병가·특근 등)을 모두 지울까요?\n달력은 다시 순환 근무 패턴만 표시됩니다.',
    )
    if (!ok) return
    clearAllShiftOverrides()
    setRefreshKey((k) => k + 1)
    setShowScheduleEditor(false)
  }

  return (
    <div className="flex h-svh max-h-svh min-h-0 flex-col overflow-hidden bg-gray-50">
      <header className="shrink-0 bg-white px-5 py-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">당비비</h1>
        <p className="text-xs text-gray-400">
          {JOB_TYPE_LABELS[setting.jobType]} · {setting.teamName}
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-6">
        <div className="shrink-0 rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs text-gray-500">
            {isFocusedToday ? '오늘' : '선택한 날'}
          </p>
          <p className="mb-3 text-base leading-relaxed text-gray-900">
            <span className="font-semibold">{focusedShort}일</span>은{' '}
            <span
              className={`inline-block rounded-full px-3 py-0.5 align-middle text-lg font-bold ${style.color} ${style.textColor}`}
            >
              {style.label}
            </span>{' '}
            입니다.
          </p>

          <button
            type="button"
            onClick={() => setShowScheduleEditor((open) => !open)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-800 active:bg-gray-100"
          >
            {showScheduleEditor
              ? '일정 편집 닫기'
              : hasOverride
                ? '일정 수정'
                : '일정 추가'}
          </button>

          {showScheduleEditor && (
            <div className="mt-4 max-h-[min(55vh,24rem)] overflow-y-auto overscroll-y-contain border-t border-gray-100 pt-4 [-webkit-overflow-scrolling:touch]">
              <OverrideEditor
                key={focusedDate}
                date={focusedDate}
                showDateHeading={false}
                onSaved={handleSaved}
                onCancel={() => setShowScheduleEditor(false)}
              />
            </div>
          )}
        </div>

        <div className="shrink-0">
          <MonthCalendar
            key={refreshKey}
            year={year}
            month={month}
            setting={setting}
            focusedDate={focusedDate}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onThisMonth={goThisMonth}
            onDayClick={handleDayClick}
          />
          {hasAnyShiftOverride() && (
            <button
              type="button"
              onClick={handleClearAllOverrides}
              className="mt-3 w-full py-2 text-center text-xs font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 active:text-gray-700"
            >
              추가 일정 모두 지우기
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
