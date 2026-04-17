import SignupForm from '@/components/auth/SignupForm'
import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Create account | ${BRAND_NAME}`,
  description: `Sign up for ${BRAND_NAME} to start planning your perfect trips.`,
}

export default function SignupPage() {
  return <SignupForm />
}
