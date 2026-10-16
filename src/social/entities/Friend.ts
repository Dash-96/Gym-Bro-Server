import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("friends")
export class Friend{

    @PrimaryGeneratedColumn({name:"Id"})
    id: number;

    @Column({name:"UserId"})
    userId: number;

    @Column({name:"FriendId"})
    friendId: number
}