import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { HowItWorks } from "@/components/home/how-it-works";
import { Reviews } from "@/components/home/reviews";

export default function Home() {
  return (
    <div>
      <Hero />
      <ValueProps />
      <Reviews />
      <HowItWorks />
    </div>
  );
}
