import { useState, useEffect, useReducer } from 'react';

const apiReducer = (state, action) => {
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

const useApi = (
  initialResource = null,
  initialData = null,
  dataType = 'json'
) => {
  const [resource, setResource] = useState(initialResource);
  const [state, dispatch] = useReducer(apiReducer, {
    data: initialData,
    isLoading: true,
    isError: false
  });

  useEffect(() => {
    let controller = new AbortController();

    const loadData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const response = await fetch(resource, {
          signal: controller.signal
        });

        let data;
        switch (dataType) {
          case 'json':
            data = await response.json();
            break;
          case 'text':
            data = await response.text();
            break;
          case 'blob':
            data = await response.blob();
            break;
          default:
            console.log('default triggered');
            data = await response.json();
            break;
        }

        console.log('useApi: got response');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL' });
        if (error.name === 'AbortError') {
          console.log(error);
          console.log('useApi: caught abort');
        } else {
          console.log(error);
          throw error;
        }
      }
    };
    resource && loadData(); // Only run when url is set.

    return () => {
      console.log('useApi: unmounting');
      controller.abort();
    };
  }, [dataType, resource]);

  return [state, setResource];
};

export default useApi;

const useSearch = (type, query) => {
  const [entity, setEntity] = useApi();
};

export const useEntity = (initialEntity = null) => {
  const [entity, setEntity] = useState(initialEntity);
  const [resource, setResource] = useApi();

  const api_url = 'https://musicbrainz.org/ws/2/';
  const cover_api_url = 'https://coverartarchive.org/release-group/';

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('fmt', 'json');

    const loadEntity = () => {
      switch (entity.type) {
        case 'album':
          params.append('inc', 'artists+releases+genres');
          setResource(api_url + `release-group/${entity.id}?` + params);
          break;
        case 'artist':
          setResource(api_url + `artist/${entity.id}?` + params);
          break;
        case 'release':
          params.append(
            'inc',
            'collections+labels+recordings+url-rels+genres+artist-rels+mediums'
          );
          setResource(api_url + `release/${entity.id}?` + params);
          break;
        case 'cover':
          setResource(cover_api_url + entity.id);
          break;
        default:
          console.log('useEntity: Errored!', entity);
          throw new Error();
      }
    };
    entity && loadEntity() && console.log('CALLED LOADENTITY');
  }, [entity, setResource]);

  return [resource, setResource, setEntity];
};
