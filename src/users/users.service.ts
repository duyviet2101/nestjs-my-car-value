import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
    //   return this.repo.save({email, password}); --> hooks in entity will not be executed :)
  }

  async findOne(id: number) {
    if (!id) return null;
    return await this.repo.findOneBy({ id });
  }

  async find(email: string) {
    return await this.repo.find({
      where: { email },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    // Partial: pass an object attrs that has none or 1, 2, or all attributes of User
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    //remove(Entity); --> use with a entity --> hook will be executed
    //delete(id); --> use with id or queries delete({email: value}) --> hook will not be executed
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return await this.repo.remove(user);
  }
}
