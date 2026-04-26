import './globals.css'

export const metadata = {
  title: 'Plan B Educational Consultants | Your Path to Top Colleges in South India',
  description: 'Expert admission guidance for Karnataka, Tamil Nadu, Kerala & Andhra Pradesh. 2,500+ students placed. Trusted counselling for Engineering, Medical, Arts & Commerce.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="noise-overlay">{children}</body>
    </html>
  )
}
