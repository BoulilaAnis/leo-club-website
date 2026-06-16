'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CLUBS } from '@/lib/club'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 py-12 md:space-y-16">
      <div>
        <AnimatedThemeToggler/>
      </div>
      <section className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Leo Club</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Leadership, Experience, Opportunity. Choose your path below.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        {CLUBS.map((club) => (
          <motion.div
            key={club.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: club.slug === 'alpha' ? 0 : 0.2 }}
          >
            <Link href={`/club/${club.slug}`} className="block">
              <Card
                className={`relative overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-1
                  ${club.slug === 'alpha' ? 'hover:border-blue-500' : 'hover:border-purple-500'}`}
              >
                <CardHeader>
                  <CardTitle className="text-3xl">{club.name}</CardTitle>
                  <CardDescription className="text-base">{club.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{club.description}</p>
                  <Button
                    variant="outline"
                    className={`w-full ${
                      club.slug === 'alpha'
                        ? 'hover:bg-blue-50 hover:text-blue-700'
                        : 'hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Enter {club.name}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
