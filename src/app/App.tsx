import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { OnboardingPage } from '@/pages/onboarding'
import { getUserSetting } from '@/entities/user-setting'

function RequireSetting({ children }: { children: React.ReactNode }) {
  const setting = getUserSetting()
  if (!setting) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col font-sans antialiased">
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/"
          element={
            <RequireSetting>
              <HomePage />
            </RequireSetting>
          }
        />
      </Routes>
    </div>
  )
}
