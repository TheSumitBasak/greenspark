import { ShieldCheck, Leaf, ReceiptText } from "lucide-react"

export function ValueProps() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <div className="badge badge-primary text-primary-foreground px-3 py-2 text-sm font-medium">
              Why GreenSpark
            </div>
          </div>
          <h2 className="mt-3 text-balance text-2xl font-bold text-foreground md:text-3xl">
            Trust, fairness, and verifiable impact
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground md:text-lg leading-relaxed">
            We make green hydrogen trading open and accountable with transparent on‑chain settlement, non‑profit
            governance, and certified environmental claims.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* DaisyUI Card for On-chain transparency */}
          <div className="card border border-border bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex flex-row items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="card-title">On‑chain transparency</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Every order, match, and settlement is recorded on-chain for auditability and public trust.
              </p>
            </div>
          </div>

          {/* DaisyUI Card for Verifiably green */}
          <div className="card border border-border bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex flex-row items-center gap-3 mb-2">
                <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="card-title">Verifiably green</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Trades are linked to renewable generation and carbon accounting for credible claims.
              </p>
            </div>
          </div>

          {/* DaisyUI Card for Non-profit fees */}
          <div className="card border border-border bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex flex-row items-center gap-3 mb-2">
                <ReceiptText className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="card-title">Non‑profit fees</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0">
                Fee structure covers operation and independent audits—no profit extraction, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
