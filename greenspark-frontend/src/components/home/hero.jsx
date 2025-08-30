"use client"

import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-pretty text-3xl font-bold leading-tight text-foreground md:text-5xl">
              A decentralized, non‑profit marketplace for Green Hydrogen
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground md:text-lg leading-relaxed">
              GreenSpark connects verified producers and buyers to trade green hydrogen with on‑chain transparency, fair
              fees, and verifiable environmental impact.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="btn btn-primary">
                  Join the movement
                </button>
              <button
                className="btn btn-outline btn-secondary"
                onClick={() => window.location.assign("#marketplace")}
              >
                Explore marketplace
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Model</dt>
                <dd className="text-sm font-semibold text-foreground">Non‑profit</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Transparency</dt>
                <dd className="text-sm font-semibold text-foreground">On‑chain</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <img
              src="/illustration-of-green-hydrogen-production--electro.png"
              alt="Illustration of green hydrogen production with electrolyzers and renewables"
              className="w-full rounded-lg border border-border"
            />
          </div>
        </div>

        <div id="mission" className="mt-10 rounded-md border border-primary/20 bg-background p-4 md:p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Operated as a public good. Fees cover maintenance and auditing only — no profit extraction. Every trade and
            certificate is auditable by design.
          </p>
        </div>
      </div>
    </section>
  )
}
