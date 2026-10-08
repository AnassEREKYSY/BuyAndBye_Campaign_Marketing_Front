import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Modal } from '@/shared/components/ui'

type Props = {
  open: boolean
  onClose: () => void
  url: string
  title: string
  fileName: string
}

// QR codes are always dark-on-white so they scan reliably, whatever the app theme.
const options = { margin: 2, color: { dark: '#2B2420', light: '#FFFFFF' }, errorCorrectionLevel: 'M' as const }

function download(href: string, name: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function QrCodeModal({ open, onClose, url, title, fileName }: Props) {
  const [png, setPng] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !url) return
    let cancelled = false
    setError(null)
    QRCode.toDataURL(url, { ...options, width: 640 })
      .then((d) => !cancelled && setPng(d))
      .catch(() => !cancelled && setError('Could not generate the QR code.'))
    return () => {
      cancelled = true
    }
  }, [open, url])

  async function downloadSvg() {
    const svg = await QRCode.toString(url, { ...options, type: 'svg' })
    const href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    download(href, `${fileName}.svg`)
    setTimeout(() => URL.revokeObjectURL(href), 1000)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="QR code"
      width="max-w-sm"
      footer={
        <>
          <button type="button" className="bb-btn-ghost" onClick={() => void downloadSvg()} disabled={!png}>
            SVG
          </button>
          <button type="button" className="bb-btn-primary" onClick={() => download(png, `${fileName}.png`)} disabled={!png}>
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download PNG
          </button>
        </>
      }
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 break-all text-xs text-bb-muted">{url}</p>
      <div className="mt-4 grid place-items-center rounded-[10px] border border-bb-border/10 bg-white p-4">
        {error ? <p className="py-16 text-sm text-bb-accent-strong">{error}</p> : png ? <img src={png} alt={`QR code for ${url}`} className="h-56 w-56" /> : <div className="bb-skeleton h-56 w-56" />}
      </div>
      <p className="mt-3 text-xs text-bb-muted">Every scan opens your tracked link, so it is counted like any other click. Use it on packaging, flyers or at events.</p>
    </Modal>
  )
}
