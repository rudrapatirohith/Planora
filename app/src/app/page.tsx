import Link from 'next/link'
import { Plane, Map, Wallet, CheckSquare, Globe, Star, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planora — Travel smarter, live fuller',
  description: 'Plan your perfect trip with intelligent itinerary management, expense tracking, and AI-powered travel suggestions.',
}

const FEATURES = [
  {
    icon: Map,
    title: 'Intelligent Itinerary',
    description: 'Day-by-day planning with a beautiful timeline interface. Organize every activity, flight, and restaurant in one place.',
    color: '#D4A017',
  },
  {
    icon: Wallet,
    title: 'Budget Mastery',
    description: 'Track expenses by category, see real-time budget progress, and never overspend on any trip again.',
    color: '#0891B2',
  },
  {
    icon: Globe,
    title: 'Booking Hub',
    description: 'Centralize all your flight, hotel, and transport confirmations. Never scramble for a booking number again.',
    color: '#10b981',
  },
  {
    icon: CheckSquare,
    title: 'Smart Checklists',
    description: 'Pre-populated packing lists, document trackers, and custom reminders so nothing gets left behind.',
    color: '#a78bfa',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant',
    description: 'Get intelligent suggestions for itinerary activities, local tips, and personalized travel recommendations.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your travel plans are encrypted and private. Row-level security ensures only you see your data.',
    color: '#ef4444',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Frequent Traveler',
    text: 'Planora transformed how I plan trips. The budget tracker alone saved me $400 on my last Europe trip.',
    stars: 5,
  },
  {
    name: 'James K.',
    role: 'Digital Nomad',
    text: 'Finally, all my bookings, itinerary, and budget in one gorgeous app. I\'ve been waiting for this.',
    stars: 5,
  },
  {
    name: 'Priya L.',
    role: 'Adventure Traveler',
    text: 'The packing checklists are a lifesaver. I never forget anything anymore and the UI is stunning.',
    stars: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0B1120', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 30%, rgba(8,145,178,0.1) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 10%, rgba(212,160,23,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 70% 70% at 50% 90%, rgba(139,92,246,0.06) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(30,45,69,0.6)',
        background: 'rgba(11,17,32,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(212,160,23,0.12)',
              border: '1px solid rgba(212,160,23,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plane style={{ width: 18, height: 18, color: '#D4A017' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: 'white' }}>Planora</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{
              padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: '#8ea3be', textDecoration: 'none', transition: 'color 0.15s',
            }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              padding: '9px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              background: '#D4A017', color: '#0B1120', textDecoration: 'none',
              transition: 'all 0.15s',
            }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 9999,
            background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)',
            marginBottom: 32,
          }}>
            <Zap style={{ width: 14, height: 14, color: '#D4A017' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#D4A017' }}>AI-Powered Travel Planning</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.1,
            color: 'white', marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Travel smarter,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #D4A017, #e8b832, #f5a623)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              live fuller
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#8ea3be', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            Your all-in-one travel companion. Plan itineraries, track expenses, manage bookings, and get AI suggestions — all in a beautifully designed workspace.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              background: '#D4A017', color: '#0B1120', textDecoration: 'none',
              boxShadow: '0 0 30px rgba(212,160,23,0.25)',
              transition: 'all 0.2s',
            }}>
              Start planning for free
              <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', color: '#e0e8f0',
              border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              Sign in
            </Link>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: '#4d6080' }}>
            No credit card required · Unlimited trips · Free forever
          </p>
        </div>

        {/* Hero visual — floating feature cards */}
        <div style={{
          maxWidth: 900, margin: '80px auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {[
            { label: 'Total trips planned', value: '12,400+', color: '#D4A017' },
            { label: 'Avg. budget saved', value: '$380', color: '#0891B2' },
            { label: 'Countries covered', value: '190+', color: '#10b981' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '24px 20px',
              background: 'rgba(20,29,46,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: stat.color, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: '#8ea3be' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              Everything you need for perfect trips
            </h2>
            <p style={{ fontSize: 16, color: '#8ea3be', maxWidth: 520, margin: '0 auto' }}>
              From first idea to final memory, Planora handles every detail of your travel planning.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} style={{
                  padding: '28px 24px',
                  background: 'rgba(20,29,46,0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 20,
                  transition: 'border-color 0.3s, transform 0.3s',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${feature.color}12`,
                    border: `1px solid ${feature.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                    <Icon style={{ width: 22, height: 22, color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 10 }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#8ea3be', lineHeight: 1.7 }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
              Loved by travelers worldwide
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                padding: '28px 24px',
                background: 'rgba(20,29,46,0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} style={{ width: 14, height: 14, color: '#D4A017', fill: '#D4A017' }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#c8d6e8', lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#4d6080' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 120px' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto', textAlign: 'center',
          padding: '64px 40px',
          background: 'linear-gradient(135deg, rgba(212,160,23,0.08), rgba(8,145,178,0.06))',
          border: '1px solid rgba(212,160,23,0.15)',
          borderRadius: 28,
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✈️</div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800, color: 'white', marginBottom: 16,
          }}>
            Ready for your next adventure?
          </h2>
          <p style={{ fontSize: 16, color: '#8ea3be', marginBottom: 36 }}>
            Join thousands of travelers who plan smarter with Planora.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 40px', borderRadius: 14, fontSize: 17, fontWeight: 700,
            background: '#D4A017', color: '#0B1120', textDecoration: 'none',
            boxShadow: '0 0 40px rgba(212,160,23,0.3)',
          }}>
            Start planning — it&apos;s free
            <ArrowRight style={{ width: 20, height: 20 }} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(30,45,69,0.6)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane style={{ width: 13, height: 13, color: '#D4A017' }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 16, color: 'white' }}>Planora</span>
        </div>
        <p style={{ fontSize: 13, color: '#4d6080' }}>
          © {new Date().getFullYear()} Planora. Travel smarter, live fuller.
        </p>
      </footer>
    </div>
  )
}
