'use client'

import LoginForm from '@/components/auth/LoginForm'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-center pb-2"
      >
        <h1
          className="sm:text-[28px] text-[20px] font-bold leading-tight mb-2 sm:text-nowrap text-wrap"
        >
          {t('sign_in_to_your_account', { defaultValue: 'Sign in to your\nAccount' })}
        </h1>
        <p className="text-center text-sm">
          {t('sign_in_subtitle', { defaultValue: 'Enter your email and password to log in' })}
        </p>
      </motion.div>

      {/* Form */}
      <LoginForm />

      {/* Sign up link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center text-[13px] pt-1 text-black dark:text-white"

      >
        {t('dont_have_account')}{' '}
        <Link
          href={ROUTES.AUTH.REGISTER}
          className="font-semibold transition-colors hover:opacity-80 text-primary"
        >
          {t('sign_up_free')}
        </Link>
      </motion.div>
    </div>
  )
}

export default LoginPage
