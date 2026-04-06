import { useState } from 'react'
import { addMonths, subMonths } from 'date-fns'

export function useMonthNavigation() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  function goNextMonth() {
    const next = addMonths(new Date(year, month - 1), 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth() + 1)
  }

  function goPrevMonth() {
    const prev = subMonths(new Date(year, month - 1), 1)
    setYear(prev.getFullYear())
    setMonth(prev.getMonth() + 1)
  }

  function goThisMonth() {
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
  }

  return { year, month, goNextMonth, goPrevMonth, goThisMonth }
}
