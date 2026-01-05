import React from 'react'
import { Header } from '@new/ui'
import { formatDate } from '@new/utils'

export default function WebHome() {
  const now = new Date()
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', padding: 28 }}>
      <Header title="Web App" />
      <main>
        <h2>Welcome to the app (apps/web)</h2>
        <p>Current server time: {formatDate(now)}</p>
        <p>This app is separate from the marketing landing site and will contain the product UI and routes.</p>
      </main>
    </div>
  )
}
