import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

//Geral

export const urlApiParam = ApiParam({
	name: 'authorization',
	required: false
});

export const urlsApiResponse401 = ApiResponse({
	status: 401,
	description: 'Token inválido ou não fornecido.'
});

//Inicio Endpoint "shorten"
export const shortenUrlApiOperation = ApiOperation({
	summary: 'Registrar os usuários',
	description: 'Este endpoint encurta o link passado como body.',
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						originalUrl: { type: 'string', example: 'https://teddydigital.io/' }
					},
					required: ['originalUrl']
				},
				examples: {
					example1: {
						summary: 'Exemplo de URL',
						value: {
							originalUrl: 'https://teddydigital.io/'
						}
					}
				}
			}
		}
	},
	responses: {
		201: {
			description: 'Url cadastrada com sucesso.'
		}
	}
});

export const shortenUrlApiResponse = ApiResponse({
	status: 201,
	description: 'Url cadastrada com sucesso'
});
//Fim Endpoint "shorten"

//Inicio Endpoint "shortUrl". Erro 404 quando não encontrado e 421 quando não é um browser
export const redirectApiOperation = ApiOperation({
	summary: 'Redirecionar para a URL original',
	description:
		'Este endpoint é responsável por redirecionar o usuário para a URL original.<br>Caso seja um browser, redireciona para a URL original, caso contrário, retorna erro 421.',
	responses: {
		200: {
			description: 'Redirecionado com sucesso.'
		},
		404: {
			description: 'URL não encontrada.'
		},
		421: {
			description: 'Por favor, abra esta URL em um navegador.'
		}
	}
});

export const redirectApiResponse200 = ApiResponse({
	status: 200,
	description: 'Redirecionado com sucesso.'
});

export const redirectApiResponse404 = ApiResponse({
	status: 404,
	description: 'URL não encontrada.'
});

export const redirectApiResponse421 = ApiResponse({
	status: 421,
	description: 'Por favor, faça o request em um navegador.'
});

//Fim Endpoint "shortUrl"

//Inicio Endpoint de listagem
export const listUrlsApiOperation = ApiOperation({
	summary: 'Listar todas as URLs',
	description:
		'Este endpoint é responsável por listar todas as URLs cadastradas no sistema baseado no Bearer Token fornecido.'
});
export const listUrlsApiResponse200 = ApiResponse({
	status: 200,
	description: 'Listado com sucesso.'
});
//Fim Endpoint de listagem

//Inicio Endpoint de updateUrl
export const updateUrlApiOperation = ApiOperation({
	summary: 'Atualizar URL',
	description:
		'Este endpoint é responsável por atualizar a URL. Passe o ID do endpoint como parâmetro e a nova URL como body.',
	requestBody: {
		required: true,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						originalUrl: { type: 'string', example: 'https://example.com' }
					},
					required: ['originalUrl', 'newUrl']
				},
				examples: {
					example1: {
						summary: 'Exemplo de atualização de URL',
						value: {
							originalUrl: 'https://example.com'
						}
					}
				}
			}
		}
	}
});
export const updateUrlApiResponse200 = ApiResponse({
	status: 200,
	description: 'Atualizado com sucesso.'
});
export const updateUrlApiResponse404 = ApiResponse({
	status: 404,
	description: 'URL não encontrada.'
});
//Fim Endpoint de updateUrl

//Inicio Endpoint de deleteUrl
export const deleteUrlApiOperation = ApiOperation({
	summary: 'Deletar URL',
	description: 'Este endpoint é responsável por deletar a URL.'
});
export const deleteUrlApiResponse200 = ApiResponse({
	status: 200,
	description: 'Deletado com sucesso.'
});
export const deleteUrlApiResponse404 = ApiResponse({
	status: 404,
	description: 'URL não encontrada.'
});
//Fim Endpoint de deleteUrl
