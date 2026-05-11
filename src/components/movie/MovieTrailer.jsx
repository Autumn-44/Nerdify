import React from 'react';

const MovieTrailer = ({ trailerUrl, title }) => {
  if (!trailerUrl) {
    return (
      <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Trailer not available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={trailerUrl}
          title={`${title} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default MovieTrailer;
