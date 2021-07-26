import { Request, Response, Router } from 'express';
import multer from 'multer';

// Multer can sometimes options
const multerConfig = multer();

const router = Router();

router.post('/products', multerConfig.single('file'), (request: Request, response: Response) => {
    console.log(request.file);
    return response.send();
});

export {
    router
}