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

@Controller('urls')
export class UrlController {
	constructor(
		private readonly urlService: UrlService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Post('shorten')
	async shortenUrl(@Body('originalUrl') originalUrl: string, @Request() req): Promise<Url> {
		const token = req.headers.authorization.split(' ')[1];
        //TODO se o token for inválido, dá erro e trava tudo.
		const decoded = await this.authService.decodeToken(token);
		const user = await this.usersService.findOne(decoded.email);

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
		return this.urlService.listUrlsByUser(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateUrl(
		@Param('id') id: number,
		@Body('originalUrl') originalUrl: string,
		@Request() req
	): Promise<Url> {
		return this.urlService.updateUrl(id, originalUrl, req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteUrl(@Param('id') id: number, @Request() req): Promise<{ success: boolean }> {
		await this.urlService.deleteUrl(id, req.user);
		return { success: true };
	}
}
