// export class CreateUserDto{
//     displayName: string;
//     password:string;
// }

export type CreateUserDto = {
  fullName: string;
  displayName: string;
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