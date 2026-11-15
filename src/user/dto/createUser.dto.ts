// export class CreateUserDto{
//     userName: string;
//     password:string;
// }

export type CreateUserDto = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  age: number;
  height: number;
  weight: number;
  profileImage?: string;
  birthDate:string
  phone:string
  gender: "male" | "female"

};