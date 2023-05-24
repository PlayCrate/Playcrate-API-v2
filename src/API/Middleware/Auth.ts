import { Request, Response, NextFunction } from 'express';

export async function Auth(req: Request, res: Response, next: NextFunction) {
	const { authorization } = req.headers;
	if (!authorization || authorization !== Bot.Config.API.Authorization) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorized',
		});
	}
	next();
}