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
	BadRequestException
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Response as ExpressRes } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
	deleteUrlApiOperation,
	deleteUrlApiResponse200,
	deleteUrlApiResponse404,
	listUrlsApiOperation,
	listUrlsApiResponse200,
	redirectApiOperation,
	redirectApiResponse200,
	redirectApiResponse404,
	redirectApiResponse421,
	shortenUrlApiOperation,
	urlApiParam,
	shortenUrlApiResponse,
	updateUrlApiOperation,
	updateUrlApiResponse200,
	updateUrlApiResponse404,
	urlsApiResponse401
} from './url.swagger';

@ApiTags('Urls')
@ApiBearerAuth()
@Controller('urls')
export class UrlController {
	constructor(
		private readonly urlService: UrlService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Post('shorten')
	@shortenUrlApiOperation
	@shortenUrlApiResponse
	@urlApiParam
	async shortenUrl(
		@Headers('authorization') authorization: string,
		@Body('originalUrl') originalUrl: string
	): Promise<Url> {
		let user: User;
		if (!originalUrl.trim()) {
			throw new BadRequestException('É necessário adicionar uma URL.');
		}

		if (authorization) {
			user = await this.getUserFromToken(authorization);
		}
		return this.urlService.shortenUrl(originalUrl, user);
	}

	@Get(':shortUrl')
	@redirectApiOperation
	@redirectApiResponse200
	@redirectApiResponse404
	@redirectApiResponse421
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
	@urlApiParam
	@listUrlsApiOperation
	@listUrlsApiResponse200
	@urlsApiResponse401
	async listUrls(@Headers('authorization') authorization: string): Promise<Url[]> {
		const user: User = await this.getUserFromToken(authorization);
		return this.urlService.listUrlsByUser(user);
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	@updateUrlApiOperation
	@updateUrlApiResponse200
	@updateUrlApiResponse404
	@urlsApiResponse401
	@urlApiParam
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
	@deleteUrlApiOperation
	@deleteUrlApiResponse200
	@deleteUrlApiResponse404
	@urlApiParam
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
