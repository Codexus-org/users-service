import { NextFunction, Request, Response } from "express";

export async function middlewareCheckOrigin(req: Request, res: Response, next: NextFunction) {
    if (req.headers.host === "localhost:8000"){
        next();
        return;
    }

    return res.status(401).json({ message: "Unauthorized" });    
};