import AlbumCard from "./AlbumCard";
import { useState } from "react";
import { Link } from "react-router-dom";
import aboutImage from "@/assets/about.webp";
import schoolImage from "@/assets/school.webp";
import instructorImage from "@/assets/instructor.webp";
import blogImage from "@/assets/blog.webp";
import aromaImage from "@/assets/aroma.webp";
import memberImage from "@/assets/member.webp";
import hiddenHeroImage from "@/assets/hidden-content-hero.webp";
import kinesiTherapyImage from "@/assets/kinesi-therapy.webp";
import aromaSetupImage from "@/assets/aroma-setup.webp";

const AlbumGrid = () => {
  const [showHiddenContent, setShowHiddenContent] = useState(false);
  
  const sections = [
    {
      id: 1,
      image: aboutImage,
      title: "カフェキネシについて",
      description: "About Cafe Kinesi",
      backgroundClass: "album-beige",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: 2,
      image: schoolImage,
      title: "スクール",
      description: "School",
      backgroundClass: "album-blue-gray",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: 3,
      image: instructorImage,
      title: "インストラクター",
      description: "Instructor",
      backgroundClass: "album-light-gray",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: 4,
      image: blogImage,
      title: "ブログ",
      description: "Blog",
      backgroundClass: "album-purple",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: 5,
      image: aromaImage,
      title: "アロマ",
      description: "Aroma",
      backgroundClass: "album-teal",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: 6,
      image: memberImage,
      title: "メンバー",
      description: "Member",
      backgroundClass: "album-light-gray",
      gridClass: "md:col-span-1 md:row-span-1"
    },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 py-12">
      {/* Uniform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          section.id === 1 ? (
            <Link key={section.id} to="/about" className="block">
              <AlbumCard
                image={section.image}
                title={section.title}
                artist={section.description}
                backgroundClass={section.backgroundClass}
                className="aspect-square cursor-pointer"
              />
            </Link>
          ) : (
            <AlbumCard
              key={section.id}
              image={section.image}
              title={section.title}
              artist={section.description}
              backgroundClass={section.backgroundClass}
              className="aspect-square"
            />
          )
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <button 
          onClick={() => setShowHiddenContent(!showHiddenContent)}
          className="view-all-button"
        >
          {showHiddenContent ? "閉じる ↑" : "View All →"}
        </button>
      </div>

      {/* Hidden Content */}
      {showHiddenContent && (
        <div className="mt-16 pt-16 border-t border-[hsl(var(--border))]">
          {/* Hero Section */}
          <div className="relative mb-16">
            <div className="aspect-[2/1] md:aspect-[3/1] overflow-hidden rounded-lg mb-8">
              <img 
                src={hiddenHeroImage} 
                alt="カフェキネシの空間"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="font-noto-serif text-3xl md:text-4xl font-medium text-[hsl(var(--text-primary))] mb-6">
                カフェキネシのページにようこそ
              </h2>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed max-w-3xl mx-auto">
                心と身体を整えるキネシオロジーとアロマを使った健康法です。
                <br className="hidden md:block" />
                誰でもどこでも簡単にできる、新しいセラピーの世界へお越しください。
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="mb-16 bg-[hsl(var(--brand-light-gray))] rounded-lg p-8">
            <h3 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-6 text-center">
              目次・詳細案内
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "1. カフェキネシとは",
                "2. カフェキネシの理念", 
                "3. カフェキネシの特徴",
                "4. カフェキネシの効果を探る",
                "5. カフェキネシの声",
                "6. カフェキネシ施設を受講する",
                "7. 公認インストラクターを探す",
                "8. アロマを購入する"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-white/50 rounded transition-colors cursor-pointer">
                  <span className="w-2 h-2 bg-[hsl(var(--brand-teal))] rounded-full flex-shrink-0"></span>
                  <span className="text-[hsl(var(--text-secondary))] text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About Section with Image */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2">
                <img 
                  src={kinesiTherapyImage} 
                  alt="キネシオロジーセラピー"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-3">
                <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-6">
                  カフェキネシとは
                </h3>
                <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                  <p className="text-lg">
                    カフェキネシとは、「カフェで出来るキネシオロジー」です。
                  </p>
                  <p>
                    だれでもどこでも簡単にできるキネシオロジーとアロマを使った健康法です。
                    誰でもどこでもその場でストレスが改善される、
                    <span className="font-noto-serif font-medium text-[hsl(var(--text-primary))]">キネシアロマ</span>を使った世界最高のキネシセラピーです。
                  </p>
                  <p>
                    世界初、最高に便利で簡単なキネシオロジー。
                    キネシオロジーって何だろうと思われる方は、ぜひ一度体験してみてください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="mb-16 bg-gradient-to-r from-[hsl(var(--brand-beige))] to-white rounded-lg p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8">
                セラピストであることから
              </h3>
              <div className="space-y-6 text-[hsl(var(--text-secondary))] leading-relaxed">
                <p className="text-lg">
                  セラピストでなくても大丈夫。必要なのはあなたの愛とあなたの手。
                </p>
                <p>
                  カフェキネシは未来実現されたばかりのセラピースタイルです。
                  わずか2時間で習得したカフェキネシを使ってセラピーが出来るようになります。
                  またカフェキネシを覚えることで出来るようになります。
                </p>
                <p className="font-medium text-[hsl(var(--text-primary))]">
                  セラピーをしながら世界中、「カフェキネシ」を伝えませんか？
                </p>
              </div>
            </div>
          </div>

          {/* History Section with Image */}
          <div className="mb-16">
            <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
              カフェキネシの歴史
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <div className="space-y-4 text-[hsl(var(--text-secondary))] leading-relaxed">
                  <p>
                    キネシオロジーというセラピーをもっとフェア（公平）に簡単に身近から出来るようにならないか？
                    シンプルだけど、効果的な方法をつくれないか？
                  </p>
                  <p>
                    そんな事を思って、<strong className="text-[hsl(var(--text-primary))]">2019年2月</strong>にカフェキネシの仕組みを作りはじめました。
                  </p>
                  <p>
                    使いやすさと、数々の症状を軽快によくなったので2019年2月、
                    ここで試用させていただいてセラピストになれるカフェキネシオロジーとアロマので、
                    どんな人が持つストレスを解決していくことができます。
                  </p>
                  <p>
                    ひとつのストレスの解決まで、約3分。
                    ストレスって毎日あるけれど、毎日セラピーはけりもしないのも。
                    友達とカフェで楽しくおしゃべりしながら、アロマの香りでストレス取りしちゃう♪
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2">
                <img 
                  src={aromaSetupImage} 
                  alt="アロマセットアップ"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h3 className="font-noto-serif text-2xl font-medium text-[hsl(var(--text-primary))] mb-8 text-center">
              カフェキネシの特長
            </h3>
            <div className="space-y-8">
              <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[hsl(var(--brand-teal))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-noto-serif text-lg font-medium text-[hsl(var(--text-primary))] mb-3">
                      短い時間で2時間程度でインストラクターになれる！
                    </h4>
                    <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                      初心者でも2時間の講座を受講するだけでインストラクター資格取得可能です。
                      2つのタイプから選択によってインストラクター登録ができる仕組みになります。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 md:p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[hsl(var(--brand-purple))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-noto-serif text-lg font-medium text-[hsl(var(--text-primary))] mb-3">
                      高性能で安全なアロマでストレスケアが楽しめる
                    </h4>
                    <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                      世界最高レベルでのアロマは自然の植物のエッセンスで作られています。
                      あなたの生活習慣の向上にあたって、あなたの心の豊かさにつながります。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-[hsl(var(--brand-beige))] via-white to-[hsl(var(--brand-light-gray))] rounded-lg p-8 md:p-12">
            <h3 className="font-noto-serif text-xl font-medium text-[hsl(var(--text-primary))] mb-4">
              カフェキネシの世界へようこそ
            </h3>
            <p className="text-[hsl(var(--text-secondary))] mb-6 leading-relaxed">
              あなたも心と身体を整える新しいセラピーを体験してみませんか？
            </p>
            <button className="view-all-button">
              詳しく見る →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumGrid;