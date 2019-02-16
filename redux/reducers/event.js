import { AsyncStorage } from 'react-native';
import { secure_fetch } from '../../services/api';
import { API, ASYNC_STORAGE } from '../../constants';

// Actions
export const ACTION_TYPES = {
  FETCH_EVENT_REQUEST: 'FETCH_EVENT_REQUEST',
  FETCH_EVENT_SUCCESS: 'FETCH_EVENT_SUCCESS',
  FETCH_EVENT_FAILURE: 'FETCH_EVENT_FAILURE',
  CREATE_EVENT_SUCCESS: 'CREATE_EVENT_SUCCESS',
  CREATE_EVENT_FAILURE: 'CREATE_EVENT_FAILURE'
};

getAsyncStorageToken = async () =>
  (await AsyncStorage.getItem(ASYNC_STORAGE.TOKEN)) || '{}';
// Action Creators
export const ACTION_CREATORS = {
  fetchEvents: () => {
    return async (dispatch, store) => {
      dispatch({
        type: ACTION_TYPES.FETCH_EVENT_REQUEST
      });
      try {
        const { access_token } = JSON.parse(await getAsyncStorageToken());

        if (!access_token) {
          throw new Error(`No access token exist. Please login.`);
        }
        const results = await secure_fetch(`${API.REST.GET_MY_EVENTS}`, {
          accessToken: access_token
        });

        if (!results.ok) {
          throw new Error(results.statusText);
        }
        let { data } = await results.json();
        dispatch({
          type: ACTION_TYPES.FETCH_EVENT_SUCCESS,
          events: data
        });
      } catch (ex) {
        console.log(ex);
        dispatch({
          type: ACTION_TYPES.FETCH_EVENT_FAILURE,
          events: []
        });
      }
    };
  },
  createEvent: () => {
    return async (dispatch, store) => {
      dispatch({
        type: ACTION_TYPES.FETCH_EVENT_REQUEST
      });
      try {
        const { access_token } = JSON.parse(await getAsyncStorageToken());

        if (!access_token) {
          throw new Error(`No access token exist. Please login.`);
        }
        const results = await secure_fetch(`${API.REST.GET_MY_MEETUPS}`, {
          accessToken: access_token
        });

        if (!results.ok) {
          throw new Error(results.statusText);
        }
        let { data } = await results.json();
        dispatch({
          type: ACTION_TYPES.CREATE_EVENT_SUCCESS,
          events: data
        });
      } catch (ex) {
        dispatch({
          type: ACTION_TYPES.CREATE_EVENT_FAILURE,
          events: []
        });
      }
    };
  }
};

// Store
const initialState = { isFetching: true, data: [] };

export const event = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_EVENT_REQUEST:
      return { ...state, isFetching: true };
    case ACTION_TYPES.FETCH_EVENT_SUCCESS:
      return { ...state, data: [...action.events], isFetching: false };
    case ACTION_TYPES.FETCH_EVENT_FAILURE:
      return initialState;
    case ACTION_TYPES.CREATE_EVENT_SUCCESS:
      return {
        ...state,
        events: [...state.data, { ...action.event }],
        isFetching: false
      };
    case ACTION_TYPES.CREATE_EVENT_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};
