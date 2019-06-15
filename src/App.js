import React, { useState, useEffect } from 'react';
import { Bloodhound } from 'typeahead.js';
import useApi from './hooks/useApi';
import Album from './Album.js';
import Search from './Search.js';

import './styles/main.scss';

const api_url = 'https://musicbrainz.org/ws/2/';

export default function App() {
  const [entity, setEntity] = useState({
    type: 'album',
    id: '2a0981fb-9593-3019-864b-ce934d97a16e'
  });

  const [resource, setResource] = useApi();
  const [results, setQuery] = useApi();

  const setAlbum = (id) => {
    setEntity({ type: 'album', id: id });
  };

  const setArtist = (id) => {
    setEntity({ type: 'artist', id: id });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('fmt', 'json');

    switch (entity.type) {
      case 'album':
        params.append('inc', 'artists+releases+genres');
        setResource(api_url + `release-group/${entity.id}?` + params);
        break;
      case 'artist':
        setResource(api_url + `artist/${entity.id}?` + params);
        break;
      default:
        throw new Error();
    }
  }, [entity.id, entity.type, setResource]);

  // useEffect(() => {
  // const response = async () => {
  //   await fetch(api_url);
  //   let url = `${api_url}/${albumID}?&api_key=${api_key}`;
  //   this.fetchApi(url);
  // };
  // //========================= BLOODHOUND ==============================//
  // let suggests = new Bloodhound({
  //   datumTokenizer: function(datum) {
  //     return Bloodhound.tokenizers.whitespace(datum.value);
  //   },
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   remote: {
  //     url:
  //       'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=cfe422613b250f702980a3bbf9e90716',
  //     filter: function(albums) {
  //       // Map the remote source JSON array to a JavaScript object array
  //       return albums.results.map(function(album) {
  //         return {
  //           value: album.original_title, // search original title
  //           id: album.id // get ID of movie simultaniously
  //         };
  //       });
  //     } // end filter
  //   } // end remote
  // }); // end new Bloodhound
  // suggests.initialize(); // initialise bloodhound suggestion engine
  // //========================= END BLOODHOUND ==============================//
  // //========================= TYPEAHEAD ==============================//
  // // Instantiate the Typeahead UI
  // $('.typeahead')
  //   .typeahead(
  //     {
  //       hint: true,
  //       highlight: true,
  //       minLength: 2
  //     },
  //     { source: suggests.ttAdapter() }
  //   )
  //   .on(
  //     'typeahead:selected',
  //     function(obj, datum) {
  //       this.fetchMovieID(datum.id);
  //     }.bind(this)
  //   ); // END Instantiate the Typeahead UI
  // //========================= END TYPEAHEAD ==============================//
  // }, [albumID]);

  return (
    <>
      <Search />
      {resource.isLoading ? (
        <p style={{ color: 'blue' }}>Loading...</p>
      ) : resource.isError ? (
        <p style={{ color: 'red' }}>Errored!</p>
      ) : (
        <>
          <Album album={resource.data} />
        </>
      )}
    </>
  );
}
