import {
  differenceInCalendarDays,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isToday as checkIsToday,
  parseISO,
} from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/date'
import { SHIFT_PATTERNS } from '@/shared/config/shiftPatterns'
import type { DisplayShiftType } from '@/shared/config/shiftPatterns'
import type { UserSetting } from '@/entities/user-setting'
import type { DayShift } from './shiftTypes'
import { getShiftOverride } from './shiftOverride'

export function getShiftForDate(date: string, setting: UserSetting): DisplayShiftType {
  // 오버라이드 우선 적용
  const override = getShiftOverride(date)
  if (override) return override.overrideType

  const { cycle } = SHIFT_PATTERNS[setting.jobType]
  const diff = differenceInCalendarDays(parseISO(date), parseISO(setting.baseDate))
  const index = ((diff + setting.baseShiftIndex) % cycle.length + cycle.length) % cycle.length
  return cycle[index]
}

function toDayShift(date: Date, setting: UserSetting): DayShift {
  const dateStr = formatDate(date)
  return {
    date: dateStr,
    shiftType: getShiftForDate(dateStr, setting),
    isToday: checkIsToday(date),
  }
}

export function getMonthShifts(year: number, month: number, setting: UserSetting): DayShift[] {
  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month - 1)),
    end: endOfMonth(new Date(year, month - 1)),
  })
  return days.map((d) => toDayShift(d, setting))
}

export function getWeekShifts(baseDate: string, setting: UserSetting): DayShift[] {
  const base = parseISO(baseDate)
  const days = eachDayOfInterval({
    start: startOfWeek(base, { weekStartsOn: 0 }),
    end: endOfWeek(base, { weekStartsOn: 0 }),
  })
  return days.map((d) => toDayShift(d, setting))
}
