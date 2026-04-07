import {
  format,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  parseISO,
} from 'date-fns'
import { ko } from 'date-fns/locale'

export {
  format,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  parseISO,
  ko,
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function today(): string {
  return formatDate(new Date())
}
