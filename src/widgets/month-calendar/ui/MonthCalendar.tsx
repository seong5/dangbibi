import { getDay, parseISO } from 'date-fns'
import { getMonthShifts } from '@/entities/shift'
import { SHIFT_STYLES } from '@/shared/config/shiftPatterns'
import type { UserSetting } from '@/entities/user-setting'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface MonthCalendarProps {
  year: number
  month: number
  setting: UserSetting
  focusedDate?: string
  onPrev: () => void
  onNext: () => void
  onThisMonth: () => void
  onDayClick?: (date: string) => void
}

export function MonthCalendar({
  year,
  month,
  setting,
  focusedDate,
  onPrev,
  onNext,
  onThisMonth,
  onDayClick,
}: MonthCalendarProps) {
  const days = getMonthShifts(year, month, setting)
  const firstDayOfWeek = getDay(parseISO(days[0].date)) // 0=일 ~ 6=토
  const emptyCells = Array.from({ length: firstDayOfWeek })

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 active:bg-gray-100"
        >
          ‹
        </button>
        <button onClick={onThisMonth} className="text-base font-bold text-gray-800">
          {year}년 {month}월
        </button>
        <button
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-500 active:bg-gray-100"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_LABELS.map((label, idx) => (
          <div
            key={label}
            className={`py-1 text-center text-xs font-semibold ${
              idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* 빈 셀 */}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* 날짜 셀 */}
        {days.map(({ date, shiftType, isToday }, idx) => {
          const style = SHIFT_STYLES[shiftType]
          const dayNum = parseInt(date.slice(8), 10)
          const colIdx = (firstDayOfWeek + idx) % 7
          const isSun = colIdx === 0
          const isSat = colIdx === 6
          const isFocused = focusedDate !== undefined && date === focusedDate

          return (
            <div
              key={date}
              className="flex flex-col items-center gap-0.5 py-0.5 active:opacity-70"
              onClick={() => onDayClick?.(date)}
            >
              {/* 날짜 숫자 */}
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday && isFocused
                    ? 'bg-gray-900 text-white'
                    : isToday
                      ? 'border border-gray-900 bg-white text-gray-900'
                      : isFocused
                        ? 'ring-2 ring-gray-900 ring-offset-1 ring-offset-white'
                        : isSun
                          ? 'text-red-400'
                          : isSat
                            ? 'text-blue-400'
                            : 'text-gray-700'
                } ${isFocused && !isToday ? (isSun ? 'text-red-500' : isSat ? 'text-blue-600' : 'text-gray-900') : ''}`}
              >
                {dayNum}
              </span>

              {/* 근무 배지 */}
              <span
                className={`w-full rounded px-0.5 py-1.5 text-center text-[9px] font-bold leading-tight ${style.color} ${style.textColor}`}
              >
                {style.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
