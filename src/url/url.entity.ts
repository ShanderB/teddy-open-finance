import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm';
import { User } from '../users/user.entity';
import { Click } from './click.entity';

@Entity()
export class Url {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	shortUrl: string;

	@Column()
	originalUrl: string;

	@Column({ nullable: true })
	deletedAt: Date;

	@ManyToOne(() => User, user => user.urls)
	user: User;

	@OneToMany(() => Click, click => click.url)
	clicks: Click[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
