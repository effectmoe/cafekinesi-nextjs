import { Facebook, Instagram, Twitter, Youtube, Music } from "lucide-react";

const SocialLinks = () => {
  // Album card colors from AlbumGrid (HSL形式で統一)
  const albumColors = [
    "hsl(35, 22%, 91%)",    // beige
    "hsl(210, 20%, 70%)",   // blue-gray
    "hsl(260, 15%, 75%)",   // purple
    "hsl(180, 20%, 85%)",   // teal
    "hsl(0, 0%, 91%)",      // light-gray
  ];

  const socialLinks = [
    { name: "Facebook", url: "#", Icon: Facebook, color: albumColors[0] },
    { name: "Instagram", url: "#", Icon: Instagram, color: albumColors[1] },
    { name: "Twitter", url: "#", Icon: Twitter, color: albumColors[2] },
    { name: "YouTube", url: "#", Icon: Youtube, color: albumColors[3] },
    { name: "Bandcamp", url: "#", Icon: Music, color: albumColors[4] },
  ];

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link) => {
            const IconComponent = link.Icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{ backgroundColor: link.color }}
                aria-label={link.name}
              >
                <IconComponent
                  className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
