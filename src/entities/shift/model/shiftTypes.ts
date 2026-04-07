export type { ShiftType, OverrideType, DisplayShiftType } from '@/shared/config/shiftPatterns'

export interface DayShift {
  date: string
  shiftType: import('@/shared/config/shiftPatterns').DisplayShiftType
  isToday: boolean
}
