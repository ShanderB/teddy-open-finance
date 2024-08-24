import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Click {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Url, url => url.clicks)
	url: Url;

	@CreateDateColumn()
	clickedAt: Date;
}
