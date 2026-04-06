import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getUserSetting } from '@/entities/user-setting'
import { getShiftForDate } from '@/entities/shift'
import { SHIFT_STYLES, JOB_TYPE_LABELS } from '@/shared/config/shiftPatterns'
import { today } from '@/shared/lib/date'
import { useMonthNavigation } from '@/features/shift-navigation'
import { OverrideModal } from '@/features/override-edit'
import { MonthCalendar } from '@/widgets/month-calendar'

export function HomePage() {
  const setting = getUserSetting()!
  const todayStr = today()
  const { year, month, goNextMonth, goPrevMonth, goThisMonth } = useMonthNavigation()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const shiftType = getShiftForDate(todayStr, setting)
  const style = SHIFT_STYLES[shiftType]
  const todayFormatted = format(parseISO(todayStr), 'M월 d일 (E)', { locale: ko })

  function handleSaved() {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-svh flex-col bg-gray-50">
      <header className="bg-white px-5 py-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">당비비</h1>
        <p className="text-xs text-gray-400">
          {JOB_TYPE_LABELS[setting.jobType]} · {setting.teamName}
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-5 py-6">
        {/* 오늘 근무 카드 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-0.5 text-xs text-gray-400">오늘</p>
          <p className="mb-2 text-sm font-semibold text-gray-700">{todayFormatted}</p>
          <span
            className={`inline-block rounded-full px-5 py-1.5 text-xl font-bold ${style.color} ${style.textColor}`}
          >
            {style.label}
          </span>
        </div>

        {/* 월간 달력 */}
        <MonthCalendar
          key={refreshKey}
          year={year}
          month={month}
          setting={setting}
          onPrev={goPrevMonth}
          onNext={goNextMonth}
          onThisMonth={goThisMonth}
          onDayClick={setSelectedDate}
        />
      </main>

      {/* 연차 입력 모달 */}
      {selectedDate && (
        <OverrideModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
