import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { getWeekShifts } from '@/entities/shift'
import { SHIFT_STYLES } from '@/shared/config/shiftPatterns'
import type { UserSetting } from '@/entities/user-setting'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface WeekViewProps {
  baseDate: string
  setting: UserSetting
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekView({ baseDate, setting, onPrev, onNext, onToday }: WeekViewProps) {
  const days = getWeekShifts(baseDate, setting)
  const startDate = days[0].date
  const endDate = days[6].date

  const rangeLabel = `${format(parseISO(startDate), 'M월 d일', { locale: ko })} – ${format(parseISO(endDate), 'M월 d일', { locale: ko })}`

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
        >
          ‹
        </button>
        <button onClick={onToday} className="text-sm font-semibold text-gray-700">
          {rangeLabel}
        </button>
        <button
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
        >
          ›
        </button>
      </div>

      {/* 7일 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, shiftType, isToday }, idx) => {
          const style = SHIFT_STYLES[shiftType]
          const dayNum = format(parseISO(date), 'd')
          const isSun = idx === 0
          const isSat = idx === 6

          return (
            <div
              key={date}
              className="flex flex-col items-center gap-1"
            >
              {/* 요일 */}
              <span
                className={`text-xs font-medium ${
                  isSun ? 'text-red-400' : isSat ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                {DAY_LABELS[idx]}
              </span>

              {/* 날짜 */}
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday
                    ? 'bg-gray-900 text-white'
                    : isSun
                      ? 'text-red-400'
                      : isSat
                        ? 'text-blue-400'
                        : 'text-gray-700'
                }`}
              >
                {dayNum}
              </span>

              {/* 근무 배지 */}
              <span
                className={`w-full rounded-md py-1 text-center text-[10px] font-bold leading-tight ${style.color} ${style.textColor}`}
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
