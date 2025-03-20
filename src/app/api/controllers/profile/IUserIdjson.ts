//api/controllers/profile/IUserIdjson.ts

export interface UserIdRequest {
    id: number; // или string, в зависимости от того, что приходит в запросе
  }

export interface UserData
{
    id:number
    fio:string
    phone_number:number
    email:string
    office:string
    otdel_id:number
    location:string
    Username:string //псевдоним
    login:string
    password:string;
    role_id:number
}
