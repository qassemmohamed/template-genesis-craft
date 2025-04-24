const BASE_URL = "http://localhost:5000/api";

export const API_LINKS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    ME: `${BASE_URL}/auth/me`,
    UPDATE: `${BASE_URL}/auth/me`,
  },
  CLIENTS: {
    BASE: `${BASE_URL}/clients`,
    GET_ALL: `${BASE_URL}/clients`,
    GET_ONE: (id: string) => `${BASE_URL}/clients/${id}`,
    CREATE: `${BASE_URL}/clients`,
    UPDATE: (id: string) => `${BASE_URL}/clients/${id}`,
    DELETE: (id: string) => `${BASE_URL}/clients/${id}`,
  },
  SERVICES: `${BASE_URL}/services`,
  FAQS: `${BASE_URL}/faqs`,
  LANGUAGES: `${BASE_URL}/languages`,
  CONTACTS: `${BASE_URL}/contacts`,
  STATS: `${BASE_URL}/stats`,
  PROFILE: `${BASE_URL}/profile`,
  FEATURES: `${BASE_URL}/features`,
  MESSAGES: {
    BASE: `${BASE_URL}/messages`,
    GET_ALL: `${BASE_URL}/messages`,
    GET_ONE: (id: string) => `${BASE_URL}/messages/${id}`,
    CREATE: `${BASE_URL}/messages`,
    REPLY: (id: string) => `${BASE_URL}/messages/${id}/reply`,
    READ: (id: string) => `${BASE_URL}/messages/${id}/read`,
    DELETE: (id: string) => `${BASE_URL}/messages/${id}`,
    UNREAD: `${BASE_URL}/messages/unread`,
  },
};

export default API_LINKS;
