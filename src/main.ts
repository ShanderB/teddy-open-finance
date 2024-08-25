import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { jwtConstants } from './auth/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

	const config = new DocumentBuilder()
		.setTitle('API de encurtamento de links')
		.setDescription('API responsável por encurtar links, criar e autenticar usuários')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	document.tags = [{ name: 'Users' }, { name: 'Auth' }, { name: 'Urls' }];

	await app.listen(3000);
}
bootstrap();
