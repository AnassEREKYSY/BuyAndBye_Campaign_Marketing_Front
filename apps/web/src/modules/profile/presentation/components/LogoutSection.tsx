import { useNavigate } from 'react-router-dom'
import { SectionTitle } from './ui'
import { useAuth } from '@/modules/auth/application/context'

export function LogoutSection() {
  const navigate = useNavigate()
  const auth = useAuth()

  return (
    <div className="space-y-5">
      <SectionTitle title="Log out" subtitle="End your session on this device. You can sign back in at any time." />
      <div>
        <button
          type="button"
          className="bb-btn-danger"
          onClick={async () => {
            await auth.logout()
            navigate('/login', { replace: true })
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}
