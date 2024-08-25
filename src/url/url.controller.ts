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
	Delete,
	NotFoundException
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Response as ExpressRes } from 'express';

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
		const user: User = await this.getUserFromToken(authorization);
		return this.urlService.shortenUrl(originalUrl, user);
	}

	@Get(':shortUrl')
	async redirect(
		@Headers('user-agent') userAgent: string,
		@Param('shortUrl') shortUrl: string,
		@Response() res: ExpressRes
	): Promise<void> {
		const url = await this.urlService.findUrlByShortUrl(shortUrl);
		if (url) {
			await this.urlService.trackClick(url);
			const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/.test(userAgent);

			if (isBrowser) {
				res.redirect(url.originalUrl);
			} else {
				res.status(421).json({ message: 'Please open this URL in a web browser.' });
			}
			return;
		}
		res.status(404).json({ error: 'URL not found' });
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async listUrls(@Headers('authorization') authorization: string): Promise<Url[]> {
		const user: User = await this.getUserFromToken(authorization);
		return this.urlService.listUrlsByUser(user);
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateUrl(
		@Headers('authorization') authorization: string,
		@Param('id') id: number,
		@Body('originalUrl') originalUrl: string
	): Promise<Url> {
		const user: User = await this.getUserFromToken(authorization);
		return this.urlService.updateUrl(id, originalUrl, user);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteUrl(
		@Headers('authorization') authorization: string,
		@Param('id') id: number
	): Promise<{ success: boolean }> {
		const user: User = await this.getUserFromToken(authorization);
		await this.urlService.deleteUrl(id, user);
		return { success: true };
	}

	private async getUserFromToken(authorization: string): Promise<User> {
		const token = authorization.split(' ')[1];
		const decoded = await this.authService.decodeToken(token);
		const user = await this.usersService.findByEmail(decoded.email);
		return user;
	}
}
