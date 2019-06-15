import React, { useEffect } from 'react';
import useApi, { useEntity } from './hooks/useApi';
import Helmet from 'react-helmet';
import dayjs from 'dayjs';

const api_url = 'https://musicbrainz.org/ws/2/';
const cover_api_url = 'https://coverartarchive.org/release-group/';
const wiki_api_url = (id) =>
  `https://musicbrainz.org/release-group/${id}/wikipedia-extract`;

export default function Album({ album }) {
  const [cover, setCover] = useApi();
  const [release, setRelease, setEntity] = useEntity();

  const releaseDate = dayjs(album['first-release-date']).format(
    'MMMM DD, YYYY'
  );
  const artists = album['artist-credit'];
  const artist = artists[0];
  const genres = album.genres;
  const releaseCandidate =
    album.releases.find(
      (release) => release.country === 'US' && release.status === 'Official'
    ).id || album.releases.find((release) => release.status === 'Official').id;

  useEffect(() => {
    setCover(cover_api_url + album.id);
    setEntity({ type: 'release', id: releaseCandidate });
    if (!cover.isLoading && !cover.isError) {
      document.body.style.backgroundImage =
        'url(' + cover.data.images[0].image + ')';
    }
  }, [
    album.id,
    album.releases,
    cover,
    release,
    releaseCandidate,
    setCover,
    setEntity,
    setRelease
  ]);
  console.log(release);
  console.log('album', album);

  return (
    <>
      <Helmet>
        <title>
          {artist.name} - {album.title}
        </title>
        {/* <link
          rel="icon"
          type="image/png"
          href={cover.data.images[0].image}
          sizes="16x16"
        /> */}
      </Helmet>
      <div className="row cardcont nopadding">
        <div className="poster-container nopadding col-md-5">
          {!cover.isError && !cover.isLoading && (
            <img
              id="postertest"
              alt="covert art"
              className="poster"
              src={cover.data.images[0].image}
            />
          )}
        </div>
        <div className="meta-data-container col-md-7">
          <h1 id="title">{album.title}</h1>
          <span className="tagline">{artist.name}</span>
          <p>{releaseDate}</p>
          <div className="additional-details">
            <span className="genre-list">
              {genres.map((genre) => genre.name.toUpperCase()).join(', ')}
            </span>
            <span className="production-list">{album['primary-type']}</span>
            <div className="row nopadding release-details mb-2">
              <div className="col">
                Original Release:
                <span className="meta-data">{releaseDate}</span>
              </div>
              <div className="col">
                Running Time:
                <span className="meta-data">
                  {!release.isLoading &&
                    millisToMinutesAndSeconds(
                      release.data.media[0].tracks.reduce(
                        (album_time, track) => (album_time += track.length),
                        0
                      )
                    )}{' '}
                  mins
                </span>
              </div>
            </div>
            <div className="row nopadding release-details">
              <div className="col">
                Box Office: <span className="meta-data">{album.title}</span>
              </div>
              <div className="col">
                Vote Average: <span className="meta-data">{album.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row cardcont">
        <div className="meta-data-container col">
          {!release.isLoading &&
            release.data.media[0].tracks.map((track, index) => {
              return (
                <div className="row justify-content-between mb-3 align-items-baseline">
                  <span className="meta-data col-lg-8">
                    {index + 1 + '. ' + track.title}
                  </span>
                  <span className="col-lg-4 text-right">
                    {millisToMinutesAndSeconds(track.length)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
