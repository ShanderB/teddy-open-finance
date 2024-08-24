import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrmConfig } from './auth/constants';
import { UrlModule } from './url/url.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		UrlModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => getOrmConfig()
		})
	],
	controllers: [],
	providers: []
})
export class AppModule {}
