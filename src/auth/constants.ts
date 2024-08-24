import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configService = new ConfigService();

const jwtSecret = configService.get<string>('JWT_SECRET');
const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN');

if (!jwtSecret || !jwtExpiresIn) {
	throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined in the environment variables.');
}

export const jwtConstants = {
	secret: jwtSecret,
	expiresIn: jwtExpiresIn
};

export const getOrmConfig = (): TypeOrmModuleOptions => ({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'teddy_user',
	password: 'password',
	database: 'teddy',
	//TODO checar esse regex
	entities: ['dist/**/*.entity{.ts,.js}'],
	synchronize: false
});
