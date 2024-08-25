import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity';

// Endpoint "register"
export const registerApiOperation = ApiOperation({
	summary: 'Registrar os usuários',
	description:
		'Este endpoint é responsável por registrar os usuários na aplicação, permitindo que eles gerenciar as URLs encurtadas.',
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
						summary: 'Exemplo de registro de usuário',
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
			description: 'Usuário registrado com sucesso',
			content: {
				'application/json': {
					example: {
						id: 1,
						email: 'user@example.com',
						createdAt: '2023-01-01T00:00:00.000Z',
						updatedAt: '2023-01-01T00:00:00.000Z'
					}
				}
			}
		},
		409: {
			description: 'Conflito - Usuário já existe'
		}
	}
});

export const registerApiResponse200 = ApiResponse({
	status: 200,
	description: 'Usuário registrado com sucesso',
	type: User
});

export const registerApiResponse409 = ApiResponse({
	status: 409,
	description: 'Conflito - Usuário já existe'
});
