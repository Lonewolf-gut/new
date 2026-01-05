import React from 'react'

export type CTA = { label: string; href?: string }

export function Hero({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: CTA }) {
  return (
    <section style={{ padding: 20, borderRadius: 8, background: '#f6f9fb', maxWidth: 880 }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ marginTop: 8, color: '#555' }}>{subtitle}</p>}
      {cta && (
        <div style={{ marginTop: 16 }}>
          <a href={cta.href || '#'} style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', borderRadius: 6, textDecoration: 'none' }}>
            {cta.label}
          </a>
        </div>
      )}
    </section>
  )
}
