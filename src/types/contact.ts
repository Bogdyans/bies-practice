


export interface Contact {
    fio: string;
    email: string;
    phone_number: string;
    job_title: string;
    otdel: string;
    organization: string;
    location: string;
    pseudonim: string;
    photo_url: string;
}

export interface ContactForList {
    id: number;
    fio: string;
}

export interface AnswererData {
    fio: string;
    email: string;
    job_title: string;
    photo_url: string;
}