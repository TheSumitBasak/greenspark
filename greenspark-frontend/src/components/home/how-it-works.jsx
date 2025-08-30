import { Network, Factory, Handshake } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground leading-relaxed md:text-lg">
            List verified supply or demand, match orders via smart contracts,
            then settle with certificates and auditable records.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <div className="card border border-border bg-base-100 shadow-sm h-full">
              <div className="card-body p-4">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <Factory
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="card-title">List supply or demand</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  Producers and buyers submit verified profiles and orders with
                  certification metadata.
                </p>
              </div>
            </div>
          </li>

          <li>
            <div className="card border border-border bg-base-100 shadow-sm h-full">
              <div className="card-body p-4">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <Network
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="card-title">Smart matching &amp; clearing</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  Orders are matched by transparent rules; clearing and
                  settlement execute on‑chain.
                </p>
              </div>
            </div>
          </li>

          <li>
            <div className="card border border-border bg-base-100 shadow-sm h-full">
              <div className="card-body p-4">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <Handshake
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="card-title">Settle &amp; verify impact</h3>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  Delivery is recorded with certificates and carbon accounting
                  for credible claims.
                </p>
              </div>
            </div>
          </li>
        </ol>

        <div
          id="marketplace"
          className="mt-10 overflow-hidden rounded-lg border border-border"
        >
          <img
            src="/flat-design-world-habitat-day-landscape.png"
            alt="Illustration of green hydrogen production with electrolyzers and renewables"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
