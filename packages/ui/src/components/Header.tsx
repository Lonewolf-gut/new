import React from 'react'

export function Header({ title }: { title?: string }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottom: '1px solid #eee' }}>
      <div style={{ fontWeight: 700 }}>{title || 'New'}</div>
      <nav>
        <a style={{ marginRight: 12 }} href="/">Landing</a>
        <a href="/app">App</a>
      </nav>
    </header>
  )
}
