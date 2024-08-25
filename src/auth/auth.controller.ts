import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserLoginResponse, UserRequest } from 'src/users/interface';
import { ApiTags } from '@nestjs/swagger';
import { loginApiOperation, loginApiResponse200, loginApiResponse401 } from './auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@loginApiOperation
	@loginApiResponse200
	@loginApiResponse401
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() { user }: UserRequest): Promise<UserLoginResponse> {
		return this.authService.login(user);
	}
}
