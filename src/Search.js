import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';

const albums = [
  {
    name: 'Presence',
    id: '42f8acce-90fc-3471-a4cd-ace1ab816276'
  },
  {
    name: 'Aladdin Sane',
    id: '50f8710f-3ae6-319b-85a7-afe783f13449'
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : albums.filter(
        (album) => album.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

export default function Search({ setAlbum }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    console.log('in onSuggestionSelected');
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
