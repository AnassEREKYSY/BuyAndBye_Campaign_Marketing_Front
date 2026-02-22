import { Outlet } from 'react-router-dom'
import { Navbar } from '@/shared/components/navbar/Navbar'
import { Snackbar } from '@/shared/components/Snackbar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <Navbar />
      <Snackbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-white/60 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Buy & Bye</p>
            <p>Influencer marketing, reinvented.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}