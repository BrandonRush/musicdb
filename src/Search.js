import React from 'react';
import musicdblogo from './musicdblogo.svg';

export default function Search() {
  return (
    <div className="col-xs-12 search-container nopadding ">
      <div className="row align-items-baseline">
        <div className="col-xs-12 col-sm-6 col-lg-5">
          <a
            // href="./"
            title="ReactJS MusicBrainz Music Search"
            // onclick="ga('send', 'event', 'link', 'internal', 'TMDB logo')"
          >
            <span className="logo">musicdb</span>
            {/* <img src={musicdblogo} className="logo" alt="Musicdb" /> */}
          </a>
        </div>
        <div className="col-xs-12 col-sm-6 col-lg-7">
          <form className="searchbox">
            <input
              // ref="search suggestion"
              // onClick={this.handleChange}
              className="searchbox__input typeahead form-control"
              type="text"
              placeholder="Search for music"
              id="q"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
