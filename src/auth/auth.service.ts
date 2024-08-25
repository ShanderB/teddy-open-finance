import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, pass: string): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		if (user && (await bcrypt.compare(pass, user.password))) {
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

	async decodeToken(
		token: string
	): Promise<{ email: string; sub: number; iat: number; exp: number }> {
		try {
			const decoded = this.jwtService.verify(token, jwtConstants.secret as JwtVerifyOptions);
			return decoded;
		} catch {
			throw new UnauthorizedException('Token inválido.');
		}
	}
}
