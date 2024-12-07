import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number): Promise<User> {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      async find(email: string): Promise<User[]> {
        return Promise.resolve([
          {
            id: 1,
            email: email,
            password: 'asdf',
          } as User,
        ]);
      },
      // async remove(id: number): Promise<User> {},
      // async update(id: number, attrs: Partial<User>): Promise<User> {},
    };
    fakeAuthService = {
      // async signup(email: string, password: string): Promise<User> {},
      async signin(email: string, password: string): Promise<User> {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser return list of users', async () => {
    const users = await controller.find('aaaa@aaaa.aaaa');
    expect(users.length).not.toEqual(0);
    expect(users).toBeDefined();
  });

  it('return user when call findUser', async () => {
    const user = controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('throws error if user with givenn id is not found', async () => {
    fakeUsersService.findOne = () => undefined;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      { email: 'aa@aa.aa', password: 'aa' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
