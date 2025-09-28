interface SchoolHeroProps {
  title?: string
  description?: string
}

export default function SchoolHero({
  title = 'スクール',
  description = 'カフェキネシオロジーは、どなたでも気軽に始められるヒーリング技術です。基礎から応用まで、段階的に学べる6つの講座をご用意しています。あなたのペースで、楽しみながら技術を身につけていきましょう。'
}: SchoolHeroProps) {
  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4">
        {title}
      </h1>
      <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed max-w-3xl">
        {description}
      </p>
    </section>
  )
}