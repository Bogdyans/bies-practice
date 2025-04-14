export interface ContactData {
    id: number;
    fio: string;
    phone_number: number;
    email: string;
    office: string;
    otdel_id: number;
    location: string;
    Username: string;
    login: string;
    role_id: number;
  }
  
  export interface ContactsResponse {
    contacts: ContactData[];
  }
  