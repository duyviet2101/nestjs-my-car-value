import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use!');
    }
    //hash password
    const hashedPassword = await hash(password, 10);
    //create a new user and save
    return await this.usersService.create(email, hashedPassword);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Wrong password!');
    }
    return user;
  }
}
