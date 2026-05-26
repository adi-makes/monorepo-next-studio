import './globals.css'
import Navbar  from '@/components/Navbar'
import Footer  from '@/components/Footer'

export const metadata = {
  title: 'YourBrand',
  description: 'Placeholder app description',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-white text-slate-900 font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
