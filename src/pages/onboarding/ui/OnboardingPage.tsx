import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUserSetting } from '@/entities/user-setting'
import { SHIFT_PATTERNS, JOB_TYPE_LABELS } from '@/shared/config/shiftPatterns'
import type { JobType } from '@/shared/config/shiftPatterns'
import { today } from '@/shared/lib/date'

const TEAM_OPTIONS = ['1조', '2조', '3조', '4조']

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [jobType, setJobType] = useState<JobType | null>(null)
  const [teamName, setTeamName] = useState('')
  const [baseDate, setBaseDate] = useState(today())
  const [baseShiftIndex, setBaseShiftIndex] = useState(0)

  function handleJobSelect(type: JobType) {
    setJobType(type)
    setStep(2)
  }

  function handleTeamSelect(team: string) {
    setTeamName(team)
    setStep(3)
  }

  function handleSubmit() {
    if (!jobType || !teamName) return
    saveUserSetting({ jobType, teamName, baseDate, baseShiftIndex })
    navigate('/')
  }

  const cycleLabels = jobType ? SHIFT_PATTERNS[jobType].cycle : []

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">당비비</h1>
        <p className="mb-8 text-sm text-gray-500">근무 패턴을 설정해주세요</p>

        {/* Step 1: 직종 선택 */}
        {step === 1 && (
          <div>
            <p className="mb-4 font-medium text-gray-700">직종을 선택해주세요</p>
            <div className="flex flex-col gap-3">
              {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleJobSelect(type)}
                  className="rounded-xl bg-white py-4 text-center text-lg font-semibold shadow-sm ring-1 ring-gray-200 active:bg-gray-100"
                >
                  {JOB_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 조 선택 */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="mb-4 text-sm text-gray-500">
              ← 이전
            </button>
            <p className="mb-4 font-medium text-gray-700">소속 조를 선택해주세요</p>
            <div className="grid grid-cols-2 gap-3">
              {TEAM_OPTIONS.map((team) => (
                <button
                  key={team}
                  onClick={() => handleTeamSelect(team)}
                  className="rounded-xl bg-white py-4 text-center text-lg font-semibold shadow-sm ring-1 ring-gray-200 active:bg-gray-100"
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 기준일 설정 */}
        {step === 3 && jobType && (
          <div>
            <button onClick={() => setStep(2)} className="mb-4 text-sm text-gray-500">
              ← 이전
            </button>
            <p className="mb-1 font-medium text-gray-700">기준일을 설정해주세요</p>
            <p className="mb-4 text-sm text-gray-400">특정 날짜에 어떤 근무였는지 알려주세요</p>

            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="mb-4 w-full rounded-xl bg-white px-4 py-3 ring-1 ring-gray-200"
            />

            <p className="mb-3 text-sm font-medium text-gray-700">
              {baseDate} 의 근무는?
            </p>
            <div className="flex gap-2 flex-wrap mb-8">
              {cycleLabels.map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setBaseShiftIndex(idx)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors ${
                    baseShiftIndex === idx
                      ? 'bg-gray-900 text-white ring-gray-900'
                      : 'bg-white text-gray-700 ring-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-gray-900 py-4 text-center font-semibold text-white active:bg-gray-700"
            >
              시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
