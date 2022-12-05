import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserDataDto } from '../dtos/UserData.dto';
import { hashPassword } from 'src/utils/helper';
import { BackendError, ErrorType } from 'src/utils/error';
import { ModifyUserDataDto } from '../dtos/ModifyUserData.dto';

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

    await this.userRepository.delete(userFromDb);
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
        } else {
          userFromDb[property] = userDataDto[property];
        }
      }
    }

    this.userRepository.save(userFromDb);
  }

  async insertUser(useDataDto: UserDataDto): Promise<void> {
    if (
      await this.userRepository.findOneBy({ username: useDataDto.username })
    ) {
      throw new BackendError(ErrorType.AlreadyExists);
    }

    const hashedPassword = hashPassword(useDataDto.password);
    const newUser = this.userRepository.create({
      ...useDataDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
  }
}
