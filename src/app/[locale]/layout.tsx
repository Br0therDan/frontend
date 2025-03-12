// path : src/[locale]/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import React from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'MySingle',
  icons: '/favicon.ico',
  description:
    'MySingle is a CRM and Sales platform for managing your business',
  keywords: [
    'crm',
    'mysingle',
    'sales',
    'project management',
    'quantative analysis',
    'quant investment',
    'location services',
    'location shareing',
    'kids care',
    'note',
  ],
  author: 'Dan Kim',
  siteName: 'MySingle',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
