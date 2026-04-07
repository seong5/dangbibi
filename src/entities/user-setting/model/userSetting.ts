import type { JobType } from '@/shared/config/shiftPatterns'
import { storageGet, storageSet, storageRemove } from '@/shared/lib/storage'

export interface UserSetting {
  jobType: JobType
  teamName: string        // '1조' | '2조' | '3조' ...
  baseDate: string        // 'YYYY-MM-DD'
  baseShiftIndex: number  // 기준일의 cycle 내 인덱스
}

const KEY = 'user-setting'

export function getUserSetting(): UserSetting | null {
  return storageGet<UserSetting>(KEY)
}

export function saveUserSetting(setting: UserSetting): void {
  storageSet(KEY, setting)
}

export function clearUserSetting(): void {
  storageRemove(KEY)
}
