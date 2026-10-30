import { Workout } from "src/workout/entities/Workout";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column({name:"display_name"})
    displayName: string;

     @Column({name:"full_name"})
    fullName: string;

    @Column()
    email: string;

    @Column({name:"avatar_url"})
    profileImage: string;

     @Column({name:"birth_date"})
    birthDate: string;

    @Column()
    password: string;

    @Column()
    gender:"male" | "female";

    @Column()
    weight: number;

    @Column({type:"jsonb" , nullable:true , default: () => "'{}'" , name:"user_meta"})
    userMeta: UserMeta





    @OneToMany(type => Workout , workout => workout.user , {cascade:["remove"]})
    workouts: Workout[]
}

interface UserMeta{
    expoToken:string;
}