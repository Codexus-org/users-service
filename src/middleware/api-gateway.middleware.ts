import { NextFunction, Request, Response } from "express";

export async function middlewareCheckOrigin(req: Request, res: Response, next: NextFunction) {
    if (req.headers.host === "16.78.80.212:3000"){
        next();
        return;
    }

    return res.status(401).json({ message: "Unauthorized" });    
};