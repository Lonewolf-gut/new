import React from 'react'
import { Hero } from '@new/ui'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, Arial', padding: 40 }}>
      <Hero
        title="Welcome to New — Landing"
        subtitle="Marketing content and signup focus. This is intentionally a different site to the web app."
        cta={{ label: 'Get started', href: '/app' }}
      />
      <section style={{ marginTop: 24 }}>
        <h2>Why we built it</h2>
        <p>
          This is the marketing landing site (apps/landing). The product web app is located at apps/web.
        </p>
      </section>
    </main>
  )
}
