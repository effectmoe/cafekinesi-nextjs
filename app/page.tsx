import AlbumGrid from '@/components/AlbumGrid'
import BlogSectionHardcoded from '@/components/BlogSectionHardcoded'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialLinks from '@/components/SocialLinks'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cafe Kinesi - 心と身体を整える空間',
  description: 'アロマテラピーとキネシオロジーが融合した新しい体験',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <AlbumGrid />
        <BlogSectionHardcoded />
      </main>
      <SocialLinks />
      <Footer />
    </div>
  )
}