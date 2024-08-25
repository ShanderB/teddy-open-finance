export interface JwtPayload {
	sub: string;
	email: string;
}

export interface JwtUser {
	password: string;
	email: string;
}
