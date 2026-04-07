export type JobType = 'fire' | 'police'

export type FireShiftType = '당직' | '첫비' | '둘비'
export type PoliceShiftType = '주간' | '야간' | '비번' | '휴무'
export type ShiftType = FireShiftType | PoliceShiftType
export type OverrideType = '연차' | '반차(오전)' | '반차(오후)' | '병가' | '특근'
export type DisplayShiftType = ShiftType | OverrideType

export interface ShiftPattern {
  jobType: JobType
  cycle: ShiftType[]
}

export const SHIFT_PATTERNS: Record<JobType, ShiftPattern> = {
  fire: {
    jobType: 'fire',
    cycle: ['당직', '첫비', '둘비'],
  },
  police: {
    jobType: 'police',
    cycle: ['주간', '야간', '비번', '휴무'],
  },
}

export interface ShiftStyle {
  label: string
  color: string
  textColor: string
}

export const SHIFT_STYLES: Record<DisplayShiftType, ShiftStyle> = {
  당직: { label: '당직', color: 'bg-red-400',    textColor: 'text-white' },
  첫비: { label: '첫비', color: 'bg-blue-300',   textColor: 'text-white' },
  둘비: { label: '둘비', color: 'bg-blue-200',   textColor: 'text-blue-800' },
  주간: { label: '주간', color: 'bg-yellow-400', textColor: 'text-white' },
  야간: { label: '야간', color: 'bg-indigo-400', textColor: 'text-white' },
  비번: { label: '비번', color: 'bg-blue-300',   textColor: 'text-white' },
  휴무: { label: '휴무', color: 'bg-gray-300',   textColor: 'text-gray-700' },
  연차: { label: '연차', color: 'bg-green-400',  textColor: 'text-white' },
  '반차(오전)': { label: '반차(오)', color: 'bg-green-200', textColor: 'text-green-800' },
  '반차(오후)': { label: '반차(후)', color: 'bg-green-200', textColor: 'text-green-800' },
  병가: { label: '병가', color: 'bg-orange-300', textColor: 'text-white' },
  특근: { label: '특근', color: 'bg-purple-400', textColor: 'text-white' },
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  fire: '소방',
  police: '경찰',
}
