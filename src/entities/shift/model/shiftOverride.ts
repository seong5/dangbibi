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
