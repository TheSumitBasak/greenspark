export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2
            id="about-title"
            className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            About GreenSpark
          </h2>
          <p className="mt-3 text-pretty text-base leading-6 text-muted-foreground md:text-lg">
            GreenSpark is a decentralized, non‑profit marketplace for verified Green Hydrogen credits (GHC). We align
            climate impact with transparent, fixed‑price trades and community‑driven oversight.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg font-medium text-foreground">Our Mission</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Accelerate adoption of Green Hydrogen by ensuring each credit represents real, audited production while
              keeping fees minimal through a transparent, non‑profit protocol.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg font-medium text-foreground">Why Decentralized</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Independent verifiers anchor off‑chain audits on‑chain for tamper‑evident records. Buyers and sellers
              transact at clear, fixed prices with standardized documentation.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg font-medium text-foreground">Non‑Profit Alignment</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Platform fees cover verification integrity and operations. No token speculation or extractive rent—only
              climate outcomes and fair market access.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-lg font-medium text-foreground">Open Governance</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A community DAO sets standards for documentation, verification, and market integrity—ensuring long‑term
              credibility and global interoperability.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
