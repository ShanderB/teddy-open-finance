import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../users/user.entity';
import { Click } from './click.entity';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
	constructor(
		@InjectRepository(Url)
		private readonly urlRepository: Repository<Url>,
		@InjectRepository(Click)
		private readonly clickRepository: Repository<Click>
	) {}
	//TODO ver algo desse coisa @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
	async shortenUrl(originalUrl: string, user: User): Promise<Url> {
		const urlDatabase = await this.findUrlByOriginalUrl(originalUrl);

		if (urlDatabase) {
			return urlDatabase;
		}

		const shortUrl = crypto
			.randomBytes(3)
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-');
		const url = this.urlRepository.create({ originalUrl, shortUrl, user });
		return this.urlRepository.save(url);
	}

	async findUrlByShortUrl(shortUrl: string): Promise<Url> {
		return this.urlRepository.findOne({ where: { shortUrl, deletedAt: null } });
	}

	async findUrlByOriginalUrl(originalUrl: string): Promise<Url> {
		return this.urlRepository.findOne({ where: { originalUrl, deletedAt: null } });
	}

	async trackClick(url: Url): Promise<void> {
		const click = this.clickRepository.create({ url });
		await this.clickRepository.save(click);
	}

	async listUrlsByUser(user: User): Promise<Url[]> {
		return this.urlRepository.find({ where: { user, deletedAt: null }, relations: ['clicks'] });
	}

	async updateUrl(id: number, newOriginalUrl: string, user: User): Promise<Url> {
		const url = await this.urlRepository.findOne({ where: { id, user, deletedAt: null } });
		if (url) {
			url.originalUrl = newOriginalUrl;
			return this.urlRepository.save(url);
		}
		return null;
	}

	async deleteUrl(id: number, user: User): Promise<void> {
		const url = await this.urlRepository.findOne({ where: { id, user, deletedAt: null } });
		if (url) {
			url.deletedAt = new Date();
			await this.urlRepository.save(url);
		}
	}
}
