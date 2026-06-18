'use client'
import AuthInput from '@/components/auth/AuthInput'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useGetDemoCredentialsQuery, useLoginMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { LoginFormValues } from '@/types/auth'
import { ApiError } from '@/types/api'
import { authUtils } from '@/utils'
import { authSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Lock, Mail, Shield, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const LoginForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const dispatch = useAppDispatch()
  const [login] = useLoginMutation()

  const { data: demoData } = useGetDemoCredentialsQuery()
  const isDemoMode = demoData?.demo === true

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap()
      // Save token and user data
      authUtils.setToken(response.token)
      authUtils.setUser(response.user)

      // Update Redux state
      dispatch(
        setAuth({
          token: response.token,
          user: response.user,
        }),
      )

      toast.success(response.message || t('login_successful'))

      // Redirect to specified path or default dashboard
      const redirectTo = searchParams.get('redirect_to')
      if (redirectTo) {
        router.replace(redirectTo)
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError?.data?.message || t('login_failed')
      toast.error(errorMessage)
    } finally {
    }
  }

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      enableReinitialize={true}
      validationSchema={authSchemas.login(t)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <AuthInput
              label={t('email')}
              name="email"
              type="email"
              icon={Mail}
              placeholder={t('email_placeholder')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-radius glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <AuthInput
              label={t('password')}
              name="password"
              type="password"
              icon={Lock}
              placeholder={'********'}
              className="border-white/10 h-12 dark:bg-black/40 rounded-radius glass-card"
            />
          </motion.div>

          <div className="flex justify-end items-center px-6">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-[13px] font-medium text-primary  tracking-tight underline underline-offset-4"
            >
              {t('forgot_password_question')}
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-radius! text-sm primary-btn text-white! font-semibold active:scale-95 transition-all duration-200 border-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  {t('signing_in')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 group">
                  {/* <div className="w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden -ml-1 group-hover:ml-0">
                    <ArrowRight className="w-6 h-6 transition-all duration-500 ease-in-out" />
                  </div> */}
                  <span className="opacity-90 tracking-wider">{t('sign_in')}</span>
                  <div className="w-4 opacity-100  transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden mr-0 ">
                    <ArrowUpRight className="w-6 h-6 transition-all duration-500 ease-in-out" />

                  </div>
                </div>
              )}
            </Button>
          </motion.div>

          {isDemoMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-dashed bg-primary/10 border-primary/30 hover:bg-primary hover:border-primary/50 text-black!  font-medium hover:text-white! dark:text-white! transition-all duration-300"
                onClick={() => {
                  setFieldValue('email', demoData?.admin?.email || '')
                  setFieldValue('password', demoData?.admin?.password || '')
                }}
              >
                <Shield className="w-4 h-4" />
                {t('admin_demo', { defaultValue: 'Demo Admin' })}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-dashed bg-primary/10 border-primary/30 hover:bg-primary hover:border-primary/50 text-black!  hover:text-white! dark:text-white! font-medium transition-all duration-300"
                onClick={() => {
                  setFieldValue('email', demoData?.user?.email || '')
                  setFieldValue('password', demoData?.user?.password || '')
                }}
              >
                <User className="w-4 h-4" />
                {t('user_demo', { defaultValue: 'Demo User' })}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
