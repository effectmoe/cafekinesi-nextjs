'use client'

import Image from 'next/image';

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
      <div className="aspect-square relative mb-6">
        <Image
          src={image}
          alt={`${title} by ${artist}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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