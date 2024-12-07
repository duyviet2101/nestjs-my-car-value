import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService HEHEHE', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    //create fake copy of users service
    const users: User[] = [];
    fakeUsersService = {
      // partial: if this object is define any property of that Class, it has to define correctly
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with hashed passworrd', async () => {
    const user = await service.signup('aaaa@aaaa.aaaa', 'asdf');

    expect(user.password).not.toEqual('asdf');
  });

  it('should throws an error if user signs up with email that in use', async () => {
    await service.signup('aaaaaa@aaaaa.aaaaa', '1');

    await expect(service.signup('aaaaaa@aaaaa.aaaaa', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throws an error if user signs in with email that not in use', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throws an error if user signs in with wrong pass', async () => {
    await service.signup('aaaaaa@aaaaa.aaaaa', '1');

    await expect(service.signin('aaaaaa@aaaaa.aaaaa', '1123')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('return user if user sign in with correct pass', async () => {
    await service.signup('aaaaaa@aaaaa.aaaaa', '1');

    const user = await service.signin('aaaaaa@aaaaa.aaaaa', '1');
    expect(user).toBeDefined();
  });
});
