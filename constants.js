import { REACT_APP_API_URL } from 'react-native-dotenv';

export const ASYNC_STORAGE = {
  TOKEN: `PU:TOKEN`,
  CACHE: `PU:CACHE`,
  SAVED_CASES: `PU:CASES`,
  CURRENT_USER: 'PU:USER'
};

export const SCREEN_TO_TITLE_MAPPING = {
  Cases: 'Surgical Cases',
  Orders: 'Orders',
  Calendar: 'Calendar',
  SetLibrary: 'Set Library',
  GetPrice: 'Get Price',
  Preferences: 'Surgeon Preferences',
  Notification: 'Notification Settings',
  Help: 'Help'
};

export const SIDEBAR_MENUS = [
  'Preferences',
  'Notification',
  'GetPrice',
  'Help'
];

export const SETS_PARTS_STATUS = {
  REQUESTED: 'Requested',
  SHIPPED: 'Shipped/Ready for Surgery'
};

export const BADGE_STATUS_COLORS = {
  New: '#B83C27',
  Requested: '#CF6E29',
  Assigned: '#FFB500',
  Shipped: '#58B837',
  'Shipped/Ready for Surgery': '#58B837',
  Closed: '#B2B4AE',
  Completed: '#2B72CC',
  Cancelled: '#000000',
  'Provider Community': '#85458A',
  Loaner: '#DDDDDD'
};

export const BADGE_TEXT_COLORS = {
  Loaner: '#000000',
  Other: '#FFFFFF',
  Assigned: '#FFFFFF'
};

export const CALENDAR_STATUS_COLORS = {
  New: '#B83C27',
  Requested: '#CF6E29',
  Assigned: '#FFB500',
  Shipped: '#58B837',
  'Shipped/Ready for Surgery': '#58B837',
  Closed: '#B2B4AE',
  Completed: '#2B72CC',
  Cancelled: '#000000',
  'Provider Community': '#85458A'
};

export const API = {
  REST: {
    USER_PROFILE: `${REACT_APP_API_URL}/profile`,
    UPDATE_USER_PROFILE: `${REACT_APP_API_URL}/updateProfile`,
    REFRESH_TOKEN: `${REACT_APP_API_URL}/refreshtoken`,
    GET_MY_MEETUPS: `${REACT_APP_API_URL}/getMyEvent?type=Meetup`,
    GET_MY_WORKSHOPS: `${REACT_APP_API_URL}/getMyEvent?type=Workshop`,
    GET_MY_EVENTS: `${REACT_APP_API_URL}/getMyEvent`
  },
  AUTH: `${REACT_APP_API_URL}/__/auth/saml`,
  AUTH_LOGOUT: `${REACT_APP_API_URL}/__/auth/saml`
};

export const TIME_FORMAT = 'MMMM Do, YYYY';

export const apiToFieldNameOrder = {
  erpNumber: 'ERP No',
  PoNumber: 'PO No',
  PoDate: 'PO Date',
  Status: 'Order Status',
  OrderBookedDate: 'Order Date',
  InvoiceDate: 'Invoice Date',
  InvoiceNumber: 'Invoice No',
  TotalAmount: 'Oracle Order Amount',
  finalbillamount: 'Total Order Amount'
};

export const DEFAULT_STATUSES = [
  'new',
  'assigned',
  'requested',
  'saved offline',
  'shipped/ready for surgery'
];

export const CURRENCY_PATTERN = /[^0-9.-]+/g;

export const DIVISIONS = [
  'Joint Replacement',
  'Trauma & Extremeties',
  'Trauma'
];
