import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	UseGuards,
	Response,
	Headers,
	Put,
	Delete
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Response as ExpressRes } from 'express';

//TODO mudar esses validadores de token req.headers para uma função só e Não chamar a mesma coisa toda vez.
//TODO adicionar um retorno caso a pessoa não esteja logada.
@Controller('urls')
export class UrlController {
	constructor(
		private readonly urlService: UrlService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Post('shorten')
	async shortenUrl(
		@Headers('authorization') authorization: string,
		@Body('originalUrl') originalUrl: string
	): Promise<Url> {
		let user: User;
		if (authorization) {
			const token = authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findByEmail(decoded.email);
		}

		return this.urlService.shortenUrl(originalUrl, user);
	}

	@Get(':shortUrl')
	async redirect(@Param('shortUrl') shortUrl: string, @Response() res: ExpressRes): Promise<void> {
		const url = await this.urlService.findUrlByShortUrl(shortUrl);
		if (url) {
			await this.urlService.trackClick(url);
			res.redirect(url.originalUrl);
			return;
			//TODO se não for pelo navegador (postman), retornar uma mensagem dizendo para abrir pelo navegador
		}
		res.status(404).json({ error: 'URL not found' });
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async listUrls(@Headers('authorization') authorization: string): Promise<Url[]> {
		let user: User;

		if (authorization) {
			const token = authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findByEmail(decoded.email);
			return this.urlService.listUrlsByUser(user);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateUrl(
		@Headers('authorization') authorization: string,
		@Param('id') id: number,
		@Body('originalUrl') originalUrl: string
	): Promise<Url> {
		let user: User;

		if (authorization) {
			const token = authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findByEmail(decoded.email);
			return this.urlService.updateUrl(id, originalUrl, user);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteUrl(
		@Headers('authorization') authorization: string,
		@Param('id') id: number
	): Promise<{ success: boolean }> {
		let user: User;

		if (authorization) {
			const token = authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findByEmail(decoded.email);
			await this.urlService.deleteUrl(id, user);
			return { success: true };
		}
	}
}
