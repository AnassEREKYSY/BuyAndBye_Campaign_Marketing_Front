import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { UserRole } from '@buyandbye/core'
import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'

export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [avatarError, setAvatarError] = useState(false)

  const avatarSrc =
    !avatarError &&
    (user?.avatarUrl?.startsWith('data:')
      ? user.avatarUrl
      : user?.avatarUrl)

  return (
    <header className="w-full bg-[#0e0f12] border-b border-white/10 text-white">
      <div className="flex items-center justify-between px-4 md:px-10 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Buy&Bye
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/home"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium"
            >
              Home
            </Link>

            <Link
              to="/browse"
              className="hover:text-orange-400 transition"
            >
              Browse
            </Link>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="flex items-center w-full max-w-md bg-[#1a1b1f] border border-white/10 rounded-full px-4 py-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              placeholder="Search products..."
              className="ml-3 w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <button className="p-2 rounded-full hover:bg-white/5 transition">
            <ShoppingCartIcon className="w-6 h-6 text-gray-300" />
          </button>

          {isAuthenticated && (
            user?.role === UserRole.SELLER ? (
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="p-2 rounded-full hover:bg-white/5 transition"
              >
                <BuildingStorefrontIcon className="w-6 h-6 text-orange-500" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/become-seller')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold hover:opacity-90 transition"
              >
                <RocketLaunchIcon className="w-4 h-4" />
                Become Seller
              </button>
            )
          )}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full overflow-hidden bg-[#1a1b1f] flex items-center justify-center"
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="p-2 rounded-full hover:bg-white/5 transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">
                Log In
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}