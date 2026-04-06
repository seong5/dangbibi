import { useState } from 'react'
import { addWeeks, subWeeks } from 'date-fns'
import { formatDate } from '@/shared/lib/date'

export function useWeekNavigation() {
  const [baseDate, setBaseDate] = useState(() => formatDate(new Date()))

  function goNextWeek() {
    setBaseDate((prev) => formatDate(addWeeks(new Date(prev), 1)))
  }

  function goPrevWeek() {
    setBaseDate((prev) => formatDate(subWeeks(new Date(prev), 1)))
  }

  function goToday() {
    setBaseDate(formatDate(new Date()))
  }

  return { baseDate, goNextWeek, goPrevWeek, goToday }
}
