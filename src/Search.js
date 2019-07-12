import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'lodash';

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = async (value) => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release-group/?query=releasegroup:${value}&fmt=json&limit=10`
    );
    const data = await response.json();
    console.log(data['release-groups']);
    return data['release-groups'].filter(
      (album) =>
        album['secondary-types'] === undefined && album.title !== 'Release'
    );
  } catch (error) {
    console.log(error);
  }
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.title;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => {
  const { title } = suggestion;
  const artist = suggestion['artist-credit'];

  return (
    <div className="search-row">
      <span id="title">{title}</span>{' '}
      <span id="artist">{artist[0].name || artist[0].artist.name}</span>
    </div>
  );
};

export default function Search({ setAlbum }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const suggestions = await getSuggestions(value);
      setSuggestions(suggestions);
    } catch (error) {
      console.log(error);
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    setAlbum({ type: 'album', id: suggestion.id });
  };

  const inputProps = {
    placeholder: 'Search for music...',
    value,
    onChange: onChange
  };

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
          {/* <form className="searchbox">
            <input
              // ref="search suggestion"
              // onClick={this.handleChange}
              className="searchbox__input typeahead form-control"
              type="text"
              placeholder="Search for music"
              id="q"
            />
          </form> */}
          <Autosuggest
            className="searchbox__input typeahead form-control"
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>
    </div>
  );
}
