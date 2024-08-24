import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Post('register')
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
	async register(@Body() body: { email: string; password: string }) {
		//TODO Implement this interface
		return this.usersService.create(body.email, body.password);
	}
}
