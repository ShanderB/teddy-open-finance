import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import * as passport from 'passport';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expiresIn }
		})
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {
	constructor(private readonly authService: AuthService) {
		passport.serializeUser((user, done) => {
			done(null, user.id);
		});

		passport.deserializeUser(async (id, done) => {
			const user = await this.authService.login(id);
			done(null, user);
		});
	}
}
