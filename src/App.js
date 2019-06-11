import React, { useState, useEffect, useReducer } from 'react';
import { Bloodhound } from 'typeahead.js';
import Album from './Album.js';
// import Search from './Search.js';

import './styles/main.scss';

const api_url = 'https://musicbrainz.org/ws/2/';

export default function App() {
  const [entity, setEntity] = useState({
    type: 'album',
    id: '2a0981fb-9593-3019-864b-ce934d97a16e'
  });

  const [resource, setUrl] = useJsonApiReducer();

  const setAlbum = (id) => {
    setEntity({ type: 'album', id: id });
  };

  const setArtist = (id) => {
    setEntity({ type: 'artist', id: id });
  };

  useEffect(() => {
    switch (entity.type) {
      case 'album':
        setUrl(`${api_url}release-group/${entity.id}?`);
        break;
      case 'artist':
        setUrl(`${api_url}artist/${entity.id}?`);
        break;
      default:
        throw new Error();
    }
  }, [entity.id, entity.type, setUrl]);

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
    <div className="App">
      {resource.isLoading ? (
        <p style={{ color: 'blue' }}>Loading...</p>
      ) : resource.isError ? (
        <p style={{ color: 'red' }}>Errored!</p>
      ) : (
        <>
          <Album album={resource.data} />
          {/* <Search fetchAlbumID /> */}
        </>
      )}
    </div>
  );
}

function useJsonApi(initialUrl, initialData = null) {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let controller = new AbortController();
    setError(false);
    setLoading(true);

    const loadData = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            fmt: 'json'
          }
        });
        const data = await response.json();
        console.log(data);
        console.log('useFetch: got response');
        setData(data);
      } catch (error) {
        setError(true);
        if (error.name === 'AbortError') {
          console.log('useFetch: caught abort');
        } else {
          throw error;
        }
      }
      setLoading(false);
    };
    loadData();

    return () => {
      console.log('useFetch: unmounting');
      controller.abort();
    };
  }, [url]);

  return [data, loading, error, setUrl];
}

const jsonApiReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false
      };
    default:
      console.log(state, action);
      throw new Error();
  }
};

const useJsonApiReducer = (initialUrl = null, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);
  const [state, dispatch] = useReducer(jsonApiReducer, {
    data: initialData,
    isLoading: true,
    isError: false
  });

  useEffect(() => {
    let controller = new AbortController();

    const loadData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const params = new URLSearchParams();
        params.append('fmt', 'json');
        params.append('inc', 'artists+releases');

        const response = await fetch(url + params, {
          signal: controller.signal
        });
        const data = await response.json();
        console.log('useJsonApiReducer: got response');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL' });
        if (error.name === 'AbortError') {
          console.log('useJsonApiReducer: caught abort');
          console.log(error);
        } else {
          throw error;
        }
      }
    };
    url && loadData(); // Only run when url is set.

    return () => {
      console.log('useJsonApiReducer: unmounting');
      controller.abort();
    };
  }, [url]);

  return [state, setUrl];
};

/*
data.album_type,
data.artists,
data.available_markets,
data.copyrights,
data.external_ids,
data.external_urls,
data.genres,
data.href,
data.id,
data.images,
data.label,
data.name,
data.popularity,
data.release_date,
data.release_date_precision,
data.tracks,
data.type,
*/
