import Image from "next/image";
import Link from "next/link";
import { Container } from "@/presentation/components/ui/container";
import { Eyebrow } from "@/presentation/components/ui/eyebrow";
import { Reveal } from "@/presentation/components/ui/reveal";
import { ICON_RATIO, offeringContent } from "@/presentation/content/home";

export function Offering() {
  const { eyebrow, title, lead, items } = offeringContent;

  return (
    <section
      aria-labelledby="offering-title"
      className="bg-tint py-24 sm:py-32"
    >
      <Container size="wide">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="offering-title" className="mt-6">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">
            {lead}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 120} className="h-full">
                <Link
                  href="/menu"
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-canvas transition-all duration-700 ease-calm hover:-translate-y-1.5 hover:border-aqua hover:shadow-[0_30px_60px_-36px_var(--brand-aqua)]"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-tint">
                    <Image
                      src={item.photo.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-1000 ease-calm group-hover:scale-105"
                    />
                  </span>
                  <span className="relative z-10 -mt-12 ml-6 block size-24 shrink-0 rounded-full border-4 border-canvas bg-tint transition-colors duration-700 ease-calm group-hover:bg-aqua-soft sm:ml-7">
                    {/* Icon art sits small inside its viewBox, so it is drawn larger than the circle. */}
                    <Image
                      src={item.icon}
                      alt=""
                      width={Math.round(120 * ICON_RATIO)}
                      height={120}
                      unoptimized
                      className="absolute top-1/2 left-1/2 h-auto w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-calm group-hover:scale-110 group-hover:-rotate-6"
                    />
                  </span>
                  <div className="flex flex-1 flex-col px-6 pt-5 pb-7 sm:px-7 sm:pb-8">
                    <h3 className="text-xl font-medium">{item.title}</h3>
                    <p className="mt-2 text-ink-muted">{item.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-crimson">
                      Ver menú
                      <span
                        aria-hidden
                        className="transition-transform duration-500 ease-calm group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-aqua transition-transform duration-700 ease-calm group-hover:scale-x-100"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
