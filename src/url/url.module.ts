import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { Click } from './click.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Url, Click])],
	controllers: [UrlController],
	providers: [UrlService]
})
export class UrlModule {}
