import { NextFunction, Request, Response } from "express";

export async function middlewareCheckOrigin(req: Request, res: Response, next: NextFunction) {
    //console.log(req.headers.host);
    if (req.headers.host === "localhost:3001"){
        return next();
    }

    return res.status(401).json({ message: "You are not allowed" });    
};