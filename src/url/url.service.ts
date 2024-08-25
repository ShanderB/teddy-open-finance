import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../users/user.entity';
import { Click } from './click.entity';
import * as crypto from 'crypto';
import { getMiscConfig } from 'src/auth/constants';

@Injectable()
export class UrlService {
	constructor(
		@InjectRepository(Url)
		private readonly urlRepository: Repository<Url>,
		@InjectRepository(Click)
		private readonly clickRepository: Repository<Click>
	) {}
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
		return this.urlRepository.findOne({ where: { shortUrl, deletedAt: IsNull() }, cache: true });
	}

	async findUrlByOriginalUrl(originalUrl: string): Promise<Url> {
		return this.urlRepository.findOne({
			where: { originalUrl, deletedAt: IsNull() },
			cache: true
		});
	}

	async trackClick(url: Url): Promise<void> {
		const click = this.clickRepository.create({ url });
		await this.clickRepository.save(click);
	}

	async listUrlsByUser(user: User): Promise<Url[]> {
		return this.urlRepository.find({
			where: {
				user: { id: user.id },
				//If the user wants to see the deleted urls, it will show them, otherwise it will not show.
				...(getMiscConfig().showDeletedUrls === 'false' && { deletedAt: IsNull() })
			},
			relations: ['clicks']
		});
	}

	async updateUrl(id: number, newOriginalUrl: string, user: User): Promise<Url> {
		const url = await this.urlRepository.findOne({
			where: { id, user: { id: user.id }, deletedAt: IsNull() },
			cache: true
		});

		if (url) {
			url.originalUrl = newOriginalUrl;
			return this.urlRepository.save(url);
		}

		throw new NotFoundException('URL with provided information not found');
	}

	async deleteUrl(id: number, user: User): Promise<void> {
		const url = await this.urlRepository.findOne({
			where: { id, user: { id: user.id }, deletedAt: IsNull() },
			cache: true
		});

		if (url) {
			url.deletedAt = new Date();
			await this.urlRepository.save(url);
			return;
		}
		throw new NotFoundException('URL id provided not found');
	}
}
