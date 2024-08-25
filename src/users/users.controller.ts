import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('register')
	async register(@Body() body: { email: string; password: string }): Promise<User> {
		const existingUser = await this.usersService.findByEmail(body.email);
		if (existingUser) {
			throw new ConflictException('User already exists');
		}

		return this.usersService.create(body.email, body.password);
	}
}
