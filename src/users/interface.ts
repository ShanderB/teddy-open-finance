import { User } from './user.entity';

export interface UserRequest {
	user: User;
}

export interface UserLoginResponse {
	access_token: string;
}
