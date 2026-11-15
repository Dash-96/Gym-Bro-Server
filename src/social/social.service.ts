import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/User';
import { UserService } from 'src/user/user.service';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/Friend';
import { Workout } from 'src/workout/entities/Workout';
import { CompetitionDataDto } from './dtos/competitonData.dto';
import { LeaderBoardFriend } from './dtos/LeaderBoardFriend.dto';
import { FriendDto } from './dtos/friend.dto';
import { UserPushNotification } from 'src/pushNotifications/entities/UserPushNotification';
import { FriendRequest } from './dtos/friendRequest.dto';

@Injectable()
export class SocialService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    @InjectRepository(Workout) private workoutRepository: Repository<Workout>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserPushNotification)
    private notificationsRespository: Repository<UserPushNotification>,
  ) {}

  //= Gets the weight of the user and the users specific rival
  async getCompetitionData(
    userId: number,
    rivalId: number,
  ): Promise<CompetitionDataDto> {
    const isFriend = await this.friendRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          qb.where('user.userId = :userId', { userId }).andWhere(
            'user.friendId = :rivalId',
            { rivalId },
          );
        }),
      )
      .getOne();

    if (!isFriend) {
      throw new UnauthorizedException('Failed to view users data');
    }

    const rival = await this.userRepository.findOne({ where: { id: rivalId } });

    const rivalWorkouts = await this.workoutRepository.find({
      relations: { exercises: { sets: true } },
      where: { userId: rivalId },
    });
    let rivalVolume = 0;
    rivalWorkouts.forEach((workout) =>
      workout.exercises.forEach((exercise) =>
        exercise.sets.forEach((set) => {
          rivalVolume += set.reps * set.weight;
        }),
      ),
    );

    const userWorkouts = await this.workoutRepository.find({
      relations: { exercises: { sets: true } },
      where: { userId: userId },
    });
    let userVolume = 0;
    userWorkouts.forEach((workout) =>
      workout.exercises.forEach((exercise) =>
        exercise.sets.forEach((set) => {
          userVolume += set.reps * set.weight;
        }),
      ),
    );

    return {
      userTotalWeightLifted: userVolume,
      rivalTotalWeightLifted: rivalVolume,
      rivalName: rival?.userName ?? '',
    };
  }

  //= Gets data for the freinds leaderboard
  async getLeaderBoardData(userId: number): Promise<LeaderBoardFriend[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // const workouts = await this.workoutRepository.find({relations:{exercises:{sets:true}} , where:{userId}})

    const userFriends = await this.friendRepository.find({ where: { userId } });
    const userFriendIds = userFriends.map((friend) => friend.friendId);

    const workouts = await this.workoutRepository
      .createQueryBuilder('workout')
      .innerJoinAndSelect('workout.user', 'user')
      .where('workout.userId In(:...userFriendIds', { userFriendIds })
      .getMany();
    const data: LeaderBoardFriend[] = [];
    userFriendIds.forEach((id) => {
      const userName =
        workouts.find((w) => w.userId == id)?.user.userName ?? 'no-name';
      const userWorkouts = workouts.filter((w) => w.userId == id);
      data.push({ userName, workouts: userWorkouts });
    });
    return data;
  }
  async getFriendsList(userId: number): Promise<FriendDto[]> {
    const friendsList = await this.friendRepository
      .createQueryBuilder('friend')
      .innerJoin(User, 'user', 'user.id=friend.friendId')
      .addSelect(['user.id AS friendId', 'user.userName AS userName' , 'user.profileImage AS profileImage' , 'user.fullName AS fullName'])
      .where('friend.userId = :userId', { userId })
      .getRawMany();
    console.log('friends List:', friendsList);
    const friendsDtoList: FriendDto[] = friendsList.map(
      ({ username, friendid , profileimage , fullname }) => ({ friendId: friendid, userName: username, profileImage: profileimage , fullName: fullname}),
    );
    return friendsDtoList
  }

  async getAllUsers(
    prefix: string,
  ): Promise<FriendDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userName ILIKE :prefix', { prefix: `${prefix}%` })
      .getMany();
    const usersList = users.map<FriendDto>((user) => ({
      friendId: user.id,
      userName: user.userName,
      profileImage: user.profileImage,
      fullName:user.fullName
    }));
    return usersList;
  }

  async getFriendRequestsForUser(userId: number): Promise<FriendRequest[]> {
    const sendersData: FriendRequest[] = await this.notificationsRespository
      .createQueryBuilder('notifications')
      .innerJoin(User, 'users', 'users.id = notifications.sender_id')
      .select('notifications.sender_id', 'senderId')
      .addSelect('users.display_name', 'senderUserName')
      .addSelect('users.avatar_url', 'avatar')
      .where('notifications.reciver_id = :reciverId', { reciverId: userId })
      .andWhere('notifications.type =:type' , {type:"friend-request"})
      .andWhere('notifications.is_approved = false')
      .getRawMany();

    return sendersData;
  }

  async acceptFriendRequest(userId: number, friendId: number) {
    const friendResult = await this.friendRepository.create({ userId, friendId });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      await queryRunner.manager.insert(Friend , {userId , friendId})
      await queryRunner.manager.insert(Friend , {userId: friendId , friendId: userId})
      await queryRunner.manager.update(UserPushNotification , {senderId: friendId , reciverId: userId} , {isApproved:true})
      await queryRunner.commitTransaction();
    }catch{
      queryRunner.rollbackTransaction()
    }finally{
      queryRunner.release();
    }
    return friendResult
  }
}
