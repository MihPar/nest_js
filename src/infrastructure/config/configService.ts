export class ConfigServce{
	JWT_SECRET: Joi.string().required()
	REFRESH_JWT_SECRET: Joi.string().required()

	EXPIRED_JWT: Joi.string().required()
	EXPIRED_REFRESH: Joi.string().required()
}