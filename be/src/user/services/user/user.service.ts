import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm/entities/User';
import { UserDataDto } from '../../dtos/UserData.dto';
import { hashPassword } from '../../../utils/bcryptUtils';
import { BackendError, ErrorType } from '../../../utils/error';
import { ModifyUserDataDto } from '../../dtos/ModifyUserData.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findUsers(limit: number = 0): Promise<User[]> {
    let ret: User[] = [];
    ret = await this.userRepository.find();

    if (limit > 0) {
      ret = ret.slice(0, limit);
    }

    if (ret.length === 0) {
      throw new BackendError(ErrorType.NoRecords, 'no users in database');
    }

    return ret;
  }

  async findUserById(userId: string): Promise<User> {
    const userFromDb = await this.userRepository.findOneBy({ id: userId });
    if (!userFromDb) {
      throw new BackendError(ErrorType.NotFound);
    }

    return userFromDb;
  }

  async removeUser(userId: string): Promise<void> {
    const userFromDb = await this.findUserById(userId);

    await this.userRepository.remove(userFromDb);
  }

  async updateUser(
    userId: string,
    userDataDto: ModifyUserDataDto,
  ): Promise<void> {
    const userFromDb = await this.findUserById(userId);

    for (let property in userFromDb) {
      if (userDataDto[property]) {
        if (property === 'password') {
          const hashedPassword = hashPassword(userDataDto.password.toString());
          userFromDb[property] = hashedPassword;
        } else if (property === 'username') {
          const exists = await this.findUserByUsername(userDataDto[property]);
          if (exists && exists.id !== userFromDb.id) {
            throw new BackendError(
              ErrorType.AlreadyExists,
              `there is already a user with username of ${userDataDto[property]}`,
            );
          }
        } else {
          userFromDb[property] = userDataDto[property];
        }
      }
    }

    await this.userRepository.save(userFromDb);
  }

  async insertUser(userDataDto: UserDataDto): Promise<void> {
    if (await this.findUserByUsername(userDataDto.username)) {
      throw new BackendError(
        ErrorType.AlreadyExists,
        `there is already a user with username of ${userDataDto.username}`,
      );
    }

    const hashedPassword = hashPassword(userDataDto.password);
    const newUser = this.userRepository.create({
      ...userDataDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
  }
}
