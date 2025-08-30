import { Star } from "lucide-react"
const reviews = [
  {
    quote:
      "GreenSpark brings clarity to a fragmented market. Fixed pricing and verifiable documentation made procurement far simpler.",
    name: "Amira Hassan",
    role: "Sustainability Lead",
    org: "HydroTech Europe",
    rating: 5,
  },
  {
    quote:
      "As a producer, I value the standardized verification templates. We spend less time on audits and more on scaling output.",
    name: "Luis Ortega",
    role: "Operations Director",
    org: "Andes GreenH2",
    rating: 5,
  },
  {
    quote:
      "As a producer, I value the standardized verification templates. We spend less time on audits and more on scaling output.",
    name: "Luis Ortega",
    role: "Operations Director",
    org: "Andes GreenH2",
    rating: 5,
  },
  {
    quote:
      "Non‑profit governance aligns incentives with climate goals—not speculation. It’s the model we’ve been waiting for.",
    name: "Dr. Wei Lin",
    role: "Policy Advisor",
    org: "Asia Clean Energy Forum",
    rating: 4,
  },
];

function Stars({ count = 5, value = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of ${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < value ? "text-primary" : "text-muted-foreground"}`}
          aria-hidden="true"
          fill={i < value ? "currentColor" : "none"}
        />
      ))}
    </div>
  )
}

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2
            id="reviews-title"
            className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            What partners say
          </h2>
          <p className="mt-3 text-pretty text-base leading-6 text-muted-foreground md:text-lg">
            Trusted by producers, buyers, and policy stakeholders advancing Green Hydrogen globally.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((r, idx) => (
            <li key={idx} className="rounded-lg border border-border bg-card p-5">
              <blockquote>
                <p className="text-pretty text-sm leading-6 text-foreground">{r.quote}</p>
              </blockquote>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.role} • {r.org}
                  </p>
                </div>
                {typeof r.rating === "number" && <Stars value={r.rating} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
