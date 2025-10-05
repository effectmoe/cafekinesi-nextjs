import Image from 'next/image'

export default function InstructorHeroSection() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="/images/instructor/hero-bg.jpg"
          alt="インストラクターセッション風景"
          fill
          className="object-cover"
          priority
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* コンテンツ */}
      <div className="relative h-full flex items-center justify-start px-6 md:px-12 lg:px-24">
        <div className="text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            インストラクターを探す
          </h1>
          <p className="text-lg md:text-xl">
            お近くのカフェキネシインストラクターを見つけましょう
          </p>
        </div>
      </div>
    </section>
  )
}
