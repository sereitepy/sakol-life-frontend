'use client'

import { useState } from 'react'
import { Mail, Phone, Send } from 'lucide-react'

const subjects = [
  'General Inquiry',
  'University Information',
  'Major Guidance',
  'Scholarship Help',
  'Technical Support',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    // TODO: wire up to your backend/email service
    setSubmitted(true)
  }

  const busy =
    !form.fullName || !form.email || !form.message

  return (
    <main className='min-h-screen bg-background text-foreground'>
      {/* Hero */}
      <section className='flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 gap-4'>
        <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight'>
          Get in Touch
        </h1>
        <p className='text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed'>
          Have questions about your academic journey in Cambodia? We&apos;re
          here to help you navigate your path toward intellectual growth and
          success.
        </p>
      </section>

      {/* Content */}
      <section className='max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-5 gap-6'>
        {/* Form */}
        <div className='md:col-span-3 bg-card border border-border rounded-xl p-7 flex flex-col gap-5 shadow-sm'>
          <h2 className='text-xl font-bold'>Send us a Message</h2>

          {submitted ? (
            <div className='flex flex-col items-center justify-center gap-4 py-10 text-center'>
              <div className='w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center'>
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-primary'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
              </div>
              <h3 className='text-lg font-semibold'>Message Sent!</h3>
              <p className='text-sm text-muted-foreground'>
                Thanks for reaching out. We&apos;ll get back to you within 24
                hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setForm({
                    fullName: '',
                    email: '',
                    subject: 'General Inquiry',
                    message: '',
                  })
                }}
                className='text-sm text-primary font-medium hover:underline'
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {/* Name + Email row */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label
                    htmlFor='fullName'
                    className='text-sm font-medium text-foreground'
                  >
                    Full Name
                  </label>
                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    placeholder='John Doe'
                    value={form.fullName}
                    onChange={handleChange}
                    className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 transition-colors'
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-foreground'
                  >
                    Email Address
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='john@example.com'
                    value={form.email}
                    onChange={handleChange}
                    className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 transition-colors'
                  />
                </div>
              </div>

              {/* Subject */}
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='subject'
                  className='text-sm font-medium text-foreground'
                >
                  Subject
                </label>
                <select
                  id='subject'
                  name='subject'
                  value={form.subject}
                  onChange={handleChange}
                  className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 transition-colors cursor-pointer'
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='message'
                  className='text-sm font-medium text-foreground'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={6}
                  placeholder='How can we assist you today?'
                  value={form.message}
                  onChange={handleChange}
                  className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 transition-colors resize-none'
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={busy}
                className='mt-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-(--radius) cursor-pointer transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Send className='w-4 h-4' />
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className='md:col-span-2 flex flex-col gap-4'>
          {/* Email */}
          <div className='bg-card border border-border rounded-xl p-6 flex items-start gap-4 shadow-sm'>
            <div className='bg-primary/10 rounded-lg p-2.5 mt-0.5'>
              <Mail className='w-5 h-5 text-primary' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <h3 className='font-semibold text-foreground'>Email Us</h3>
              <p className='text-sm text-primary font-medium'>
                rmeas@paragoniu.edu.kh
              </p>
              <p className='text-xs text-muted-foreground'>
                Response within 24 hours
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className='bg-card border border-border rounded-xl p-6 flex items-start gap-4 shadow-sm'>
            <div className='bg-primary/10 rounded-lg p-2.5 mt-0.5'>
              <Phone className='w-5 h-5 text-primary' />
            </div>
            <div className='flex flex-col gap-0.5'>
              <h3 className='font-semibold text-foreground'>Call Us</h3>
              <p className='text-sm text-primary font-medium'>
                +855 92 851 501
              </p>
              <p className='text-xs text-muted-foreground'>
                Mon – Fri, 8am – 5pm
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}