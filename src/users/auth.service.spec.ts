import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

// describe('AuthService', () => {
//   let service: AuthService;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AuthService],
//     }).compile();
//
//     service = module.get<AuthService>(AuthService);
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

it('can create an instance of auth service', async () => {
  //create fake copy of users service
  const fakeUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({
        email,
        password,
        id: 1,
      }),
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

  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
