import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
	registerApiOperation,
	registerApiResponse200,
	registerApiResponse409
} from './user.swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('register')
	@registerApiOperation
	@registerApiResponse200
	@registerApiResponse409
	async register(@Body() body: { email: string; password: string }): Promise<User> {
		const existingUser = await this.usersService.findByEmail(body.email);
		if (existingUser) {
			throw new ConflictException('Usuário já existe.');
		}

		return this.usersService.create(body.email, body.password);
	}
}
