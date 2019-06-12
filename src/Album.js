import React, { useEffect } from 'react';
import useApi from './hooks/useApi';

const cover_api_url = 'https://coverartarchive.org/release-group/';
const wiki_api_url = (id) =>
  `https://musicbrainz.org/release-group/${id}/wikipedia-extract`;

export default function Album({ album }) {
  const [cover, setCover] = useApi();

  const releaseDate = album['first-release-date'];
  const artists = album['artist-credit'];
  const artist = artists[0];

  useEffect(() => {
    setCover(cover_api_url + album.id);
    if (!cover.isLoading && !cover.isError) {
      document.body.style.backgroundImage =
        'url(' + cover.data.images[0].image + ')';
      // document.body.style.backgroundImage = 'url(' + backdropIMG + ')';
    }
  }, [album.id, cover, setCover]);

  return (
    <div className="col-xs-12 cardcont nopadding">
      <div className="meta-data-container col-xs-12 col-md-8 push-md-4 col-lg-7 push-lg-5">
        <h1>{album.title}</h1>
        <span className="tagline">{artist.name}</span>
        <p>{releaseDate}</p>
        <div className="additional-details">
          <span className="genre-list">{album.title}</span>
          <span className="production-list">{album.title}</span>
          <div className="row nopadding release-details">
            <div className="col-xs-6">
              Original Release:
              <span className="meta-data">{album.title}</span>
            </div>
            <div className="col-xs-6">
              Running Time:
              <span className="meta-data">{album.title} mins</span>
            </div>
            <div className="col-xs-6">
              Box Office: <span className="meta-data">{album.title}</span>
            </div>
            <div className="col-xs-6">
              Vote Average: <span className="meta-data">{album.title}</span>
            </div>
          </div>
        </div>
      </div>
      {!cover.isError && !cover.isLoading && (
        <div className="poster-container nopadding col-xs-12 col-md-4 pull-md-8 col-lg-5 pull-lg-7 ">
          <img
            id="postertest"
            alt="covert art"
            className="poster"
            src={cover.data.images[0].image}
          />
        </div>
      )}
    </div>
  );
}
