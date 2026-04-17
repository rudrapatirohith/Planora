import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Sign in | ${BRAND_NAME}`,
  description: `Sign in to your ${BRAND_NAME} account to start planning your perfect trip.`,
}

export default function LoginPage() {
  return <LoginForm />
}
