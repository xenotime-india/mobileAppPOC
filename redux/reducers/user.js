// Actions
export const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT'
};

// Action Creators
export const ACTION_CREATORS = {
  setUser: user => {
    return async (dispatch, store) => {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        user
      });
    };
  },
  restoreUser: () => {
    return {
      type: ACTION_TYPES.LOGOUT
    };
  }
};

// Selectors
export const SELECTORS = {};

// Store
const initialState = {};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return { ...state, ...action.user };
    case ACTION_TYPES.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
