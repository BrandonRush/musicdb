import React, { useState, useEffect, useReducer } from 'react';

export default function Album({ album, cover }) {
  const releaseDate = album['first-release-date'];
  const artists = album['artist-credit'];
  const artist = artists[0];

  return (
    <div className="col-xs-12 cardcont nopadding">
      <div className="meta-data-container col-xs-12 col-md-8 push-md-4 col-lg-7 push-lg-5">
        <h1>{album.title}</h1>
        <span className="tagline">{releaseDate}</span>
        <p>{artist.name}</p>
        <div className="additional-details">
          <span className="genre-list">{album.title}</span>
          <span className="production-list">{album.title}</span>
          <div className="row nopadding release-details">
            <div className="col-xs-6">
              {' '}
              Original Release:{' '}
              <span className="meta-data">{album.release}</span>
            </div>
            <div className="col-xs-6">
              {' '}
              Running Time:{' '}
              <span className="meta-data">{album.runtime} mins</span>{' '}
            </div>
            <div className="col-xs-6">
              {' '}
              Box Office: <span className="meta-data">{album.title}</span>
            </div>
            <div className="col-xs-6">
              {' '}
              Vote Average: <span className="meta-data">{album.vote}</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="poster-container nopadding col-xs-12 col-md-4 pull-md-8 col-lg-5 pull-lg-7 ">
        <img id="postertest" className="poster" src={posterIMG} />
      </div> */}
    </div>
  );
}
