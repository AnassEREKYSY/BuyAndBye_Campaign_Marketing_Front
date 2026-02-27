import { useNavigate } from 'react-router-dom'
import { PrimaryButton, SubtleCard } from './ui'
import { useAuth } from '@/modules/auth/application/context'

export function LogoutSection() {
  const navigate = useNavigate()
  const auth = useAuth()

  return (
    <div className="space-y-6">
      <SubtleCard>
        <p className="text-lg font-extrabold bb-title-text">Logout</p>
        <p className="mt-1 text-sm bb-subtle-text">End your session on this device.</p>

        <div className="mt-4 flex justify-end">
          <PrimaryButton
            type="button"
            onClick={async () => {
              await auth.logout()
              navigate('/login', { replace: true })
            }}
          >
            Logout
          </PrimaryButton>
        </div>
      </SubtleCard>
    </div>
  )
}