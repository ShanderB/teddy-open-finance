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
	type: configService.get<string>('DB_TYPE') as 'mysql',
	host: configService.get<string>('DB_HOST'),
	port: configService.get<number>('DB_PORT'),
	username: configService.get<string>('DB_USERNAME'),
	password: configService.get<string>('DB_PASSWORD'),
	database: configService.get<string>('DB_DATABASE'),
	entities: ['dist/**/*.entity{.ts,.js}'],
	synchronize: true
});

export const getMiscConfig = (): { showDeletedUrls: string } => ({
	showDeletedUrls: configService.get<string>('SHOW_DELETED_URLS')
});
