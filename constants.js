import { REACT_APP_API_URL } from 'react-native-dotenv';

export const ASYNC_STORAGE = {
  TOKEN: `AOLF:TOKEN`,
  CACHE: `AOLF:CACHE`,
  CURRENT_USER: 'AOLF:USER'
};

export const API = {
  REST: {
    USER_PROFILE: `${REACT_APP_API_URL}/profile`,
    UPDATE_USER_PROFILE: `${REACT_APP_API_URL}/updateProfile`,
    REFRESH_TOKEN: `${REACT_APP_API_URL}/refreshtoken`,
    GET_MY_MEETUPS: `${REACT_APP_API_URL}/getMyEvent?type=Meetup`,
    GET_MY_WORKSHOPS: `${REACT_APP_API_URL}/getMyEvent?type=Workshop`,
    GET_MY_EVENTS: `${REACT_APP_API_URL}/getMyEvent`,
    GET_ALL_TEACHERS: `${REACT_APP_API_URL}/cf/teachers`,
    GET_ALL_MEETUP_MASTER: `${REACT_APP_API_URL}/getAllMeetupMaster`,
    MARK_ATTENDANCE: `${REACT_APP_API_URL}/markAttendance`,
    UPSERT_MEETUP: `${REACT_APP_API_URL}/upsertMeetup`
  },
  AUTH: `${REACT_APP_API_URL}/__/auth/saml`,
  AUTH_LOGOUT: `${REACT_APP_API_URL}/__/auth/saml`
};

export const TIME_FORMAT = 'MMMM Do, YYYY';

export const DEFAULT_STATUSES = [
  'new',
  'assigned',
  'requested',
  'saved offline',
  'shipped/ready for surgery'
];
