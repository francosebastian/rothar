'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Faq {
  id: string
  question: string
  answer: string
  order: number
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => { setFaqs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-[#E6DAB9]">
      <Navbar />
      <section className="pt-32 pb-20 bg-[#063d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider mb-4">
            PREGUNTAS FRECUENTES
          </h1>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto"></div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-[#084C4C]">Cargando...</p>
          ) : faqs.length === 0 ? (
            <p className="text-center text-[#084C4C]/70">No hay preguntas frecuentes disponibles.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-[#084C4C] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#063d3d] transition-colors"
                  >
                    <span className="text-[#E6DAB9] font-display tracking-wider text-lg">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-[#E6DAB9] transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openId === faq.id && (
                    <div className="px-6 pb-4 text-[#E6DAB9]/80 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Footer />
    </main>
  )
}
