import React, { useState, useEffect } from 'react';
import typeahead, { Bloodhound } from 'typeahead.js';
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

  return (
    <>
      <Search setAlbum={setEntity} />
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
