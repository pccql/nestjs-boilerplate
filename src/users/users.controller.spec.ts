import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create user', async () => {
      const user = {
        id: '1',
        name: 'Pedro Queiroz',
        email: 'test@gmail.com',
        password: 'a',
      };

      jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(user));

      expect(await controller.create(user)).toBe(user);
    });

    it('should throw error when email is already in use', async () => {
      const users = [
        { id: '1', name: 'User 1', email: 'test@gmail.com', password: 'a' },
        { id: '2', name: 'User 2', email: 'test2@gmail.com', password: 'a' },
      ];

      jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(() => Promise.resolve(users[0]));

      try {
        await controller.create(users[1]);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('Email already taken', HttpStatus.BAD_REQUEST),
        );
      }
    });
  });

  describe('findOne', () => {
    it('should return the user', async () => {
      const user = {
        id: '1',
        name: 'User 1',
        email: 'test@gmail.com',
        password: 'a',
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      expect(await controller.findOne(user.id)).toBe(user);
    });

    it('should throw a Not Found Error when user is not found', async () => {
      const wrongId = '1';

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      try {
        await controller.findOne(wrongId);
      } catch (error) {
        expect(error).toEqual(
          new HttpException('User not found', HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      const users = [];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(users));

      expect(await controller.findAll()).toBe(users);
    });

    it('should return array of users', async () => {
      const users = [
        { id: '1', name: 'User 1', email: 'test@gmail.com', password: 'a' },
        { id: '2', name: 'User 2', email: 'test2@gmail.com', password: 'a' },
      ];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(users));

      expect(await controller.findAll()).toBe(users);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        id: '1',
        name: 'Pedro Queiroz',
        email: 'test@gmail.com',
        password: 'a',
      };

      const updatedUser = { ...user, name: 'New name' };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(user));

      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(updatedUser));

      expect(await controller.update(user.id, updatedUser)).toBe(updatedUser);
    });
  });
});
