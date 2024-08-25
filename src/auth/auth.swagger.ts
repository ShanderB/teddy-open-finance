import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Endpoint "login"
export const loginApiOperation = ApiOperation({
	summary: 'Fazer o login do usuário',
	description: 'Este endpoint é responsável por retornar o token de acesso do usuário informado.',
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						email: { type: 'string', example: 'user@example.com' },
						password: { type: 'string', example: 'password123' }
					},
					required: ['email', 'password']
				},
				examples: {
					example1: {
						summary: 'Exemplo de login de usuário',
						value: {
							email: 'user@example.com',
							password: 'password123'
						}
					}
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Usuário registrado com sucesso'
		},
		409: {
			description: 'Token Inválido'
		}
	}
});

export const loginApiResponse200 = ApiResponse({
	status: 200,
	description: 'Usuário logado com sucesso'
});

export const loginApiResponse401 = ApiResponse({
	status: 401,
	description: 'Token Inválido'
});
