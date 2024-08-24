import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { jwtConstants } from './auth/constants';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.use(
		session({
			secret: jwtConstants.secret,
			resave: false,
			saveUninitialized: false,
			cookie: { maxAge: 3600000 }
		})
	);

	await app.listen(3000);
}
bootstrap();
