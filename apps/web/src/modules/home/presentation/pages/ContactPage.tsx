import { useState } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

/** Public contact address. There is no contact API yet, so the form opens the visitor's email app. */
const CONTACT_EMAIL = 'hello@kickback.app'

const topics = ['A question about Kickback', 'Brand account', 'Creator account', 'Something is not working', 'Other']

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(topics[0])
  const [message, setMessage] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = `${message.trim()}\n\n${name.trim()}${email.trim() ? ` <${email.trim()}>` : ''}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:pt-20">
      <div className="bb-pop">
        <p className="bb-eyebrow">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Get in touch</h1>
        <p className="mt-5 max-w-md text-[17px] leading-7 text-bb-muted">
          Questions about Kickback, help with your account, or feedback on the product. Tell us what you need and we will reply by email.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="bb-stat-icon">
            <EnvelopeIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-bb-muted">Email</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="bb-link">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <p className="mt-8 max-w-md text-sm leading-6 text-bb-muted">
          To help us answer quickly, say whether you are a brand or a creator, and include the campaign name if your question is about one.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bb-card grid gap-4 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="bb-label">
              Name
            </label>
            <input id="contact-name" className="bb-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="contact-email" className="bb-label">
              Email
            </label>
            <input id="contact-email" type="email" className="bb-input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
        </div>

        <div>
          <label htmlFor="contact-topic" className="bb-label">
            Topic
          </label>
          <select id="contact-topic" className="bb-select w-full" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="bb-label">
            Message
          </label>
          <textarea id="contact-message" className="bb-input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bb-muted">Sending opens your email app with this message filled in.</p>
          <button type="submit" className="bb-btn-primary">
            Send message
          </button>
        </div>
      </form>
    </section>
  )
}
