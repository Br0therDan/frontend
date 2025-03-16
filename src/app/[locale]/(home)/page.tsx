// path: src/[locale]/page.tsx
import React from 'react'
import { MyButton } from '@/components/common/buttons/submit-button'
import Image from 'next/image'
import Link from 'next/link'
import { getDictionary } from '@/locales/dictionaries'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'ko' }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return (

      <div className='flex-col flex justify-center w-full p-4 space-y-4'>
        <Image
          src='/images/logo_sq_light.png'
          alt='MySingle Logo'
          width={200}
          height={200}
        />
        <h1 className='text-3xl font-bold'>{dict.landing_page.title}</h1>
        <p>{dict.landing_page.description}</p>
        <div className='flex space-x-4'>
          <MyButton>
            <Link href='/auth/signup'>{dict.landing_page.get_started}</Link>
          </MyButton>
          <MyButton>
            <Link href='/auth/login'>{dict.landing_page.login}</Link>
          </MyButton>
        </div>
      </div>

  )
}
