import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/modules/auth/application/context"

interface BecomeSellerFormState {
  storeName: string
  countryCode: string
  companyName: string
  storeDescription: string
  storeBanner: File | undefined
}

export function BecomeSellerPage() {
  const navigate = useNavigate()
  const { becomeSeller, updateSellerProfile } = useAuth()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<BecomeSellerFormState>({
    storeName: "",
    countryCode: "",
    companyName: "",
    storeDescription: "",
    storeBanner: undefined,
  })

  const handleChange = <K extends keyof BecomeSellerFormState>(key: K, value: BecomeSellerFormState[K]): void => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await becomeSeller({
        storeName: form.storeName,
        countryCode: form.countryCode,
      })

      await updateSellerProfile({
        storeName: form.storeName,
        companyName: form.companyName,
        storeDescription: form.storeDescription,
        storeBanner: form.storeBanner,
      })

      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    "w-full bg-[#111217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition"

  return (
    <div className="min-h-screen bg-[#0e0f12] flex justify-center items-center px-6 py-16">
      <div className="w-full max-w-2xl bg-[#15161a] border border-white/10 rounded-3xl p-10">

        <h1 className="text-2xl font-semibold text-white mb-8">
          Become a Seller 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            placeholder="Store Name"
            value={form.storeName}
            onChange={e => handleChange("storeName", e.target.value)}
            className={inputStyle}
            required
          />

          <input
            placeholder="Country Code"
            value={form.countryCode}
            onChange={e => handleChange("countryCode", e.target.value)}
            className={inputStyle}
            required
          />

          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={e => handleChange("companyName", e.target.value)}
            className={inputStyle}
          />

          <textarea
            placeholder="Store Description"
            value={form.storeDescription}
            onChange={e => handleChange("storeDescription", e.target.value)}
            className={`${inputStyle} resize-none`}
            rows={4}
          />

          <label className="flex items-center justify-between px-4 py-3 bg-[#111217] border border-white/10 rounded-xl cursor-pointer">
            <span className="text-sm text-white/60">
              {form.storeBanner ? form.storeBanner.name : "Choose store banner"}
            </span>
            <input
              type="file"
              hidden
              onChange={e => handleChange("storeBanner", e.target.files?.[0])}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Seller Account"}
          </button>

        </form>
      </div>
    </div>
  )
}