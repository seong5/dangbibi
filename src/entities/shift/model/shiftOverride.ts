import type { OverrideType } from '@/shared/config/shiftPatterns'
import { storageGet, storageSet } from '@/shared/lib/storage'

export interface ShiftOverride {
  date: string
  overrideType: OverrideType
  memo?: string
}

const KEY = 'shift-overrides'

type OverrideMap = Record<string, ShiftOverride>

function getOverrideMap(): OverrideMap {
  return storageGet<OverrideMap>(KEY) ?? {}
}

export function getShiftOverride(date: string): ShiftOverride | null {
  return getOverrideMap()[date] ?? null
}

export function saveShiftOverride(override: ShiftOverride): void {
  const map = getOverrideMap()
  map[override.date] = override
  storageSet(KEY, map)
}

export function deleteShiftOverride(date: string): void {
  const map = getOverrideMap()
  delete map[date]
  storageSet(KEY, map)
}

/** 휴가·특근 등 추가 일정을 모두 제거하고 순환 근무만 표시 */
export function clearAllShiftOverrides(): void {
  storageSet(KEY, {})
}

export function hasAnyShiftOverride(): boolean {
  return Object.keys(getOverrideMap()).length > 0
}
