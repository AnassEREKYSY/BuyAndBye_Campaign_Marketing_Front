import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../application/context'
import { useNotification } from '@/shared/context/notification'
import { PasswordField } from '../components/PasswordField'
import styles from './RegisterPage.module.css'

type RegisterStep = 1 | 2 | 3 | 4

interface FormData {
  email: string
  displayName: string
  password: string
  passwordConfirmation: string
}

interface FormErrors {
  email: string
  displayName: string
  password: string
  passwordConfirmation: string
  general: string
}

interface LegalAcceptance {
  cgu: boolean
  rgpd: boolean
  cgv: boolean
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, user, isLoading } = useAuth()
  const { success, error: showError, warning } = useNotification()

  const [currentStep, setCurrentStep] = useState<RegisterStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    email: '',
    displayName: '',
    password: '',
    passwordConfirmation: '',
  })

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    displayName: '',
    password: '',
    passwordConfirmation: '',
    general: '',
  })

  const [legalAcceptance, setLegalAcceptance] = useState<LegalAcceptance>({
    cgu: false,
    rgpd: false,
    cgv: false,
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>('')

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {
      email: '',
      displayName: '',
      password: '',
      passwordConfirmation: '',
      general: '',
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required'
    } else if (formData.displayName.length < 3) {
      newErrors.displayName = 'Display name must be at least 3 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Please confirm your password'
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match'
    }

    setErrors(newErrors)
    return (
      !newErrors.email &&
      !newErrors.displayName &&
      !newErrors.password &&
      !newErrors.passwordConfirmation
    )
  }

  const handleStep1Next = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    } else {
      showError('Please fix the errors in the form before continuing')
    }
  }

  const handleStep2Next = () => {
    setCurrentStep(3)
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
    setErrors({ email: '', displayName: '', password: '', passwordConfirmation: '', general: '' })
  }

  const handleStep3Back = () => {
    setCurrentStep(2)
    setErrors({ email: '', displayName: '', password: '', passwordConfirmation: '', general: '' })
  }

  const handleCreateAccount = async () => {
    if (!legalAcceptance.cgu || !legalAcceptance.rgpd || !legalAcceptance.cgv) {
      warning('Please accept all legal documents to continue')
      return
    }

    setIsSubmitting(true)
    setErrors({ email: '', displayName: '', password: '', passwordConfirmation: '', general: '' })

    try {
      await register({
        email: formData.email,
        displayName: formData.displayName,
        password: formData.password,
        photo: profileImage || undefined,
      })

      success('Account created successfully! Welcome to Buy & Bye!')
      setCurrentStep(4)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      showError(message)
      setErrors({
        email: '',
        displayName: '',
        password: '',
        passwordConfirmation: '',
        general: message,
      })
      setCurrentStep(1)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = () => {
    navigate('/home')
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file')
        return
      }
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
        success('Profile picture uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const allLegalAccepted = legalAcceptance.cgu && legalAcceptance.rgpd && legalAcceptance.cgv

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={`${styles.page} flex min-h-screen items-center`}>
      <div className="ml-auto w-full max-w-md px-6 md:mr-20">
        <div className="rounded-3xl bg-white/10 p-10 shadow-2xl backdrop-blur-lg border border-white/20">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            {currentStep === 1 && 'Create your account'}
            {currentStep === 2 && 'Complete your profile'}
            {currentStep === 3 && 'Accept Terms'}
            {currentStep === 4 && 'Welcome!'}
          </h1>

          <div className="mt-6 space-y-6">
            {currentStep === 1 && (
              <>
                <p className="text-sm text-white/70">
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange-300 hover:text-orange-200 font-medium">
                    Sign in
                  </Link>
                </p>

                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    {errors.displayName && (
                      <p className="mt-1 text-xs text-red-400">{errors.displayName}</p>
                    )}
                  </div>

                  <PasswordField
                    value={formData.password}
                    onChange={(password) => setFormData({ ...formData, password })}
                    placeholder="Password"
                    error={errors.password}
                  />

                  <div>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.passwordConfirmation}
                      onChange={(e) =>
                        setFormData({ ...formData, passwordConfirmation: e.target.value })
                      }
                      className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    {errors.passwordConfirmation && (
                      <p className="mt-1 text-xs text-red-400">{errors.passwordConfirmation}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleStep1Next}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white hover:brightness-110 transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex justify-between text-sm text-white/70">
                  <button onClick={handleStep2Back} className="hover:text-white">
                    ← Back
                  </button>
                  <button onClick={handleStep2Next} className="hover:text-white">
                    Skip
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    hidden
                  />

                  <div
                    onClick={() => document.getElementById('profileImageInput')?.click()}
                    className="w-32 h-32 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition overflow-hidden"
                  >
                    {profileImagePreview ? (
                      <img src={profileImagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-white/50">+</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleStep2Next}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white hover:brightness-110 transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <button onClick={handleStep3Back} className="text-sm text-white/70 hover:text-white">
                  ← Back
                </button>

                <div className="space-y-4 text-white/80 text-sm">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={legalAcceptance.cgu}
                      onChange={(e) =>
                        setLegalAcceptance({ ...legalAcceptance, cgu: e.target.checked })
                      }
                    />
                    Accept CGU
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={legalAcceptance.rgpd}
                      onChange={(e) =>
                        setLegalAcceptance({ ...legalAcceptance, rgpd: e.target.checked })
                      }
                    />
                    Accept RGPD
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={legalAcceptance.cgv}
                      onChange={(e) =>
                        setLegalAcceptance({ ...legalAcceptance, cgv: e.target.checked })
                      }
                    />
                    Accept CGV
                  </label>

                  {errors.general && <p className="text-sm text-red-400">{errors.general}</p>}

                  <button
                    onClick={handleCreateAccount}
                    disabled={!allLegalAccepted || isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white hover:brightness-110 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <p className="text-white/80 text-sm">Account created successfully!</p>

                <button
                  onClick={handleContinue}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-semibold text-white hover:brightness-110 transition"
                >
                  Continue
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}