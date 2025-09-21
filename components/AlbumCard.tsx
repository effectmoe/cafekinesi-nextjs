'use client'

interface AlbumCardProps {
  image: string;
  title: string;
  artist: string;
  backgroundClass: string;
  className?: string;
}

const AlbumCard = ({ image, title, artist, backgroundClass, className = "" }: AlbumCardProps) => {
  return (
    <div className={`album-card ${backgroundClass} p-8 rounded-none ${className}`}>
      <div className="aspect-square mb-6">
        <img 
          src={image} 
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <h3 className="album-title">{title}</h3>
        <p className="album-title opacity-80">{artist}</p>
      </div>
    </div>
  );
};

export default AlbumCard;