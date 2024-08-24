import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, pass: string): Promise<unknown> {
		//TODO: Implement this interface
		const user = await this.usersService.findOne(email);
		if (user && (await bcrypt.compare(pass, user.password))) {
			// const { password, ...result } = user;
			const { ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: User): Promise<{ access_token: string }> {
		const payload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload)
		};
	}
}
