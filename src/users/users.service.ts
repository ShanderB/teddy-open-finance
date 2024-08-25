import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	async create(email: string, password: string): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = this.usersRepository.create({ email, password: hashedPassword });
		return this.usersRepository.save(user);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		const user = this.usersRepository.findOne({ where: { email } });
		if (user) {
			return user;
		}
		throw new NotFoundException('User not found');
	}
}
