import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import ScrollRevealText from '@/components/ui/ScrollRevealText'

export default function Mission() {
  return (
    <section id="how" className="relative w-full bg-surface py-28 md:py-40">
      <Container size="default">
        <div className="mb-10">
          <SectionLabel number="04">Why Gradly exists</SectionLabel>
        </div>

        <ScrollRevealText
          className="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight [text-wrap:balance]"
          base="text-ink-200"
          highlight="text-ink-900"
        >
          {`Brilliant students across Ghana lose admission offers every year because their transcripts don't speak the language of the schools they're applying to. Gradly was built to fix that — to translate your grades into any system on earth, and show you, honestly, which doors are open. No guesswork. No gatekeepers. Just clarity.`}
        </ScrollRevealText>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat number="40+" label="Countries" />
          <Stat number="200+" label="Conversion rules" />
          <Stat number="14k+" label="Students helped" />
          <Stat number="< 30s" label="Average time to result" />
        </div>
      </Container>
    </section>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-t border-ink-100 pt-5">
      <div className="font-display text-3xl md:text-5xl text-ink-900 tracking-tight">
        {number}
      </div>
      <div className="mt-2 font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-ink-500">
        {label}
      </div>
    </div>
  )
}
