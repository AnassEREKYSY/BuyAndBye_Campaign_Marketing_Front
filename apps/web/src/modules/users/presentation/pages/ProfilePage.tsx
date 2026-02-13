import { useState, useRef } from "react"
import { useAuth } from "@/modules/auth/application/context"
import { UserIcon, PencilIcon, XMarkIcon, CameraIcon } from "@heroicons/react/24/outline"
import { UserRole, ProfileStatus } from "@buyandbye/core"

interface ProfileFormState {
  displayName: string
  phoneNumber: string
  birthDate: string
  gender: string
  countryCode: string
  locale: string
  storeName: string
  companyName: string
  storeDescription: string
  photo: File | undefined
  storeBanner: File | undefined
}

export function ProfilePage() {
  const { user, updateUserProfile, updateSellerProfile } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState<ProfileFormState>({
    displayName: user?.displayName ?? "",
    phoneNumber: user?.profile?.phoneNumber ?? "",
    birthDate: user?.profile?.birthDate ?? "",
    gender: user?.profile?.gender ?? "",
    countryCode: user?.profile?.countryCode ?? "",
    locale: user?.profile?.locale ?? "",
    storeName: user?.sellerProfile?.storeName ?? "",
    companyName: user?.sellerProfile?.companyName ?? "",
    storeDescription: user?.sellerProfile?.storeDescription ?? "",
    photo: undefined,
    storeBanner: undefined,
  })

  if (!user) return null

  const handleChange = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]): void => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      await updateUserProfile({
        displayName: form.displayName,
        photo: form.photo,
        phoneNumber: form.phoneNumber,
        birthDate: form.birthDate,
        gender: form.gender,
        countryCode: form.countryCode,
        locale: form.locale,
      })

      if (user.role === UserRole.SELLER) {
        await updateSellerProfile({
          storeName: form.storeName,
          companyName: form.companyName,
          storeDescription: form.storeDescription,
          storeBanner: form.storeBanner,
        })
      }

      setIsEditing(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm(prev => ({
      ...prev,
      photo: undefined,
      storeBanner: undefined,
    }))
    setIsEditing(false)
  }

  const previewAvatar =
    form.photo ? URL.createObjectURL(form.photo) : user.avatarUrl

  const inputStyle =
    "w-full bg-[#111217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition"

  const sectionTitle =
    "text-sm uppercase tracking-wider text-white/40 font-medium"

  const statusColor =
    user.profileStatus === ProfileStatus.ACTIVE
      ? "bg-green-500"
      : user.profileStatus === ProfileStatus.INCOMPLETE
      ? "bg-orange-500"
      : "bg-gray-500"

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <div className="bg-[#15161a] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative">

          <div className="absolute top-6 right-6 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            <span className="text-xs text-white/50 capitalize">
              {user.profileStatus}
            </span>
          </div>

          <div
            className={`relative w-40 h-40 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 p-1 shadow-lg ${
              isEditing ? "cursor-pointer" : ""
            }`}
            onClick={() => isEditing && avatarInputRef.current?.click()}
          >
            <div className="w-full h-full rounded-full bg-[#15161a] flex items-center justify-center overflow-hidden">
              {previewAvatar ? (
                <img src={previewAvatar} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-white/60" />
              )}
            </div>

            {isEditing && (
              <div className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full shadow-lg">
                <CameraIcon className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            hidden
            onChange={e => handleChange("photo", e.target.files?.[0])}
          />

          <h2 className="mt-6 text-xl font-semibold tracking-wide">
            {user.displayName}
          </h2>

          <span className="mt-2 text-xs px-4 py-1 rounded-full bg-white/5 text-orange-400 font-medium">
            {user.role.toUpperCase()}
          </span>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-8 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-medium hover:opacity-90 transition"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="mt-8 flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-sm text-white/70 hover:bg-white/5 transition"
            >
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        <div className="md:col-span-2 bg-[#15161a] border border-white/10 rounded-3xl p-10">

          {!isEditing ? (
            <div className="space-y-10">

              <div>
                <h3 className={sectionTitle}>Account</h3>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <Info label="Display Name" value={user.displayName} />
                  <Info label="Phone" value={user.profile?.phoneNumber} />
                  <Info label="Birth Date" value={user.profile?.birthDate} />
                  <Info label="Country" value={user.profile?.countryCode} />
                </div>
              </div>

              {user.role === UserRole.SELLER && (
                <div>
                  <h3 className={sectionTitle}>Store Information</h3>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <Info label="Store Name" value={user.sellerProfile?.storeName} />
                    <Info label="Company" value={user.sellerProfile?.companyName} />
                    <div className="md:col-span-2">
                      <Info label="Store Description" value={user.sellerProfile?.storeDescription} />
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">

              <div>
                <h3 className={sectionTitle}>Account</h3>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                  <input
                    value={form.displayName}
                    onChange={e => handleChange("displayName", e.target.value)}
                    placeholder="Display Name"
                    className={inputStyle}
                  />

                  <input
                    value={form.phoneNumber}
                    onChange={e => handleChange("phoneNumber", e.target.value)}
                    placeholder="Phone Number"
                    className={inputStyle}
                  />

                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={e => handleChange("birthDate", e.target.value)}
                    className={inputStyle}
                  />

                  <input
                    value={form.countryCode}
                    onChange={e => handleChange("countryCode", e.target.value)}
                    placeholder="Country Code"
                    className={inputStyle}
                  />

                </div>
              </div>

              {user.role === UserRole.SELLER && (
                <div>
                  <h3 className={sectionTitle}>Store Information</h3>
                  <div className="mt-6 space-y-6">

                    <div>
                      <label className="block text-xs text-white/40 uppercase mb-2">
                        Store Banner
                      </label>

                      <label className="flex items-center justify-between px-4 py-3 bg-[#111217] border border-white/10 rounded-xl cursor-pointer hover:border-orange-500/40 transition">
                        <span className="text-sm text-white/60">
                          {form.storeBanner ? form.storeBanner.name : "Choose store banner"}
                        </span>
                        <CameraIcon className="w-5 h-5 text-white/40" />
                        <input
                          type="file"
                          hidden
                          onChange={e => handleChange("storeBanner", e.target.files?.[0])}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        value={form.storeName}
                        onChange={e => handleChange("storeName", e.target.value)}
                        placeholder="Store Name"
                        className={inputStyle}
                      />

                      <input
                        value={form.companyName}
                        onChange={e => handleChange("companyName", e.target.value)}
                        placeholder="Company Name"
                        className={inputStyle}
                      />

                      <textarea
                        value={form.storeDescription}
                        onChange={e => handleChange("storeDescription", e.target.value)}
                        placeholder="Store Description"
                        className={`${inputStyle} md:col-span-2 resize-none`}
                        rows={4}
                      />
                    </div>

                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border-b border-white/5 pb-3">
      <p className="text-xs text-white/40 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-sm text-white">
        {value || "-"}
      </p>
    </div>
  )
}
