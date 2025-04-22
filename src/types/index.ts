
export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  [key: string]: string;
}

export interface CustomField {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
}
