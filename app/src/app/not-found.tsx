import Link from 'next/link'
import { BRAND_NAME } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] aurora-bg text-white px-4">
      <div className="text-center animate-fade-in-up">
        {/* Large decorative number */}
        <div className="relative mb-8">
          <span className="text-[160px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#D4A017]/30 to-transparent leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[160px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#D4A017]/20 to-transparent leading-none blur-sm select-none">
              404
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Destination Not Found
          </h1>
          <p className="text-[#8ea3be] text-lg max-w-md mx-auto">
            Looks like this route doesn&apos;t exist on your travel map. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="btn btn-primary"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="btn btn-secondary"
          >
            Back to Home
          </Link>
        </div>

        {/* Decorative compass/globe */}
        <div className="mt-16 text-[#4d6080] text-6xl animate-float">
          🧭
        </div>
      </div>
    </div>
  )
}
