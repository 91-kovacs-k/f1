import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserParams } from 'src/utils/types';
import { UserDataDto } from '../dtos/UserData.dto';
import {
  checkIfValidUUID,
  comparePasswords,
  hashPassword,
} from 'src/utils/helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new NotFoundException();
    }
    return users;
  }

  async findUserById(userId: string): Promise<User> {
    if (checkIfValidUUID(userId)) {
      const userFromDb = await this.userRepository.findOneBy({ id: userId });
      if (!userFromDb) {
        throw new NotFoundException();
      }

      return userFromDb;
    }
    throw new NotFoundException();
  }

  async removeUser(userId: string): Promise<void> {
    const userFromDb = await this.findUserById(userId);

    await this.userRepository.delete(userFromDb);
  }

  async updateUser(userId: string, userData: UserDataDto): Promise<void> {
    const userFromDb = await this.findUserById(userId);

    if (userData.password) {
      const hashedPassword = hashPassword(userData.password.toString());
      userFromDb.password = hashedPassword;
    }

    if (userData.username) {
      userFromDb.username = userData.username;
    }

    this.userRepository.save(userFromDb);
  }

  async insertUser(userDetails: UserParams): Promise<User> {
    if (
      await this.userRepository.findOneBy({ username: userDetails.username })
    ) {
      throw new ConflictException(
        `username '${userDetails.username}' already exists.`,
        {
          description: 'conflicting usernames',
        },
      );
    }

    const hashedPassword = hashPassword(userDetails.password);
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async authenticateUser(userDetails: UserDataDto): Promise<User> {
    const userFromDb = await this.userRepository.findOneBy({
      username: userDetails.username,
    });

    if (!userFromDb) {
      throw new UnauthorizedException();
    }

    if (!comparePasswords(userDetails.password, userFromDb.password)) {
      throw new UnauthorizedException();
    }

    return userFromDb;
  }

  async logoutUser(userId: string): Promise<void> {
    // TODO: delete session data from DB
    // BLOCKER for this: need to store session data in DB first
  }
}
