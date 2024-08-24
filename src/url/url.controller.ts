import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	UseGuards,
	Request,
	Put,
	Delete
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
//TODO mudar esses req.headers para uma função só e Não chamar a mesma coisa toda vez.
//TODO adicionar a interface dos req.
//TODO adicionar um retorno caso a pessoa não esteja logada.
@Controller('urls')
export class UrlController {
	constructor(
		private readonly urlService: UrlService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Post('shorten')
	async shortenUrl(@Body('originalUrl') originalUrl: string, @Request() req): Promise<Url> {
		let user: User;
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findOne(decoded.email);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.urlService.shortenUrl(originalUrl, user);
	}

	@Get(':shortUrl')
	async redirect(
		@Param('shortUrl') shortUrl: string,
		@Request() req
	): Promise<{ redirect?: string; error?: string }> {
		const url = await this.urlService.findUrlByShortUrl(shortUrl);
		if (url) {
			await this.urlService.trackClick(url);
			return { redirect: url.originalUrl };
		}
		return { error: 'URL not found' };
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async listUrls(@Request() req): Promise<Url[]> {
		let user: User;

		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findOne(decoded.email);
			return this.urlService.listUrlsByUser(user);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateUrl(
		@Param('id') id: number,
		@Body('originalUrl') originalUrl: string,
		@Request() req
	): Promise<Url> {
		let user: User;

		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findOne(decoded.email);
			return this.urlService.updateUrl(id, originalUrl, user);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteUrl(@Param('id') id: number, @Request() req): Promise<{ success: boolean }> {
		let user: User;

		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await this.authService.decodeToken(token);
			user = await this.usersService.findOne(decoded.email);
			await this.urlService.deleteUrl(id, user);
			return { success: true };
		}
	}
}
