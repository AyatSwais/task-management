// import { CreateUserDto } from './dto/create-user.dto.js';
// import {
//   Injectable,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';

// @Injectable()
// export class UsersService {
//   private users = [
//     {
//       id: 1,
//       name: 'Ayat',
//       email: 'ayat@example.com',
//       password: '123456',
//       role: 'MANAGER',
//     },
//     {
//       id: 2,
//       name: 'Ahmad',
//       email: 'ahmad@example.com',
//       password: '123456',
//       role: 'MEMBER',
//     },
//   ];

//   private nextId = 3;

//   findAll() {
//     return this.users;
//   }

//   findById(id: number) {
//     const user = this.users.find((user) => user.id === id);

//     if (!user) {
//       throw new NotFoundException(`User with id ${id} not found`);
//     }

//     return user;
//   }

//   findByEmail(email: string) {
//     return this.users.find((user) => user.email === email);
//   }

//   create(userData: CreateUserDto) {
//     const existingUser = this.findByEmail(userData.email);

//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const newUser = {
//       id: this.nextId++,
//       name: userData.name,
//       email: userData.email,
//       password: userData.password,
//       role: 'MEMBER',
//     };

//     this.users.push(newUser);

//     return newUser;
//   }
// }
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/client.js';

import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData: CreateUserDto) {
    const existingUser = await this.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: Role.MEMBER,
      },
    });
  }
}
