import { Request, Response, Router } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import readLine from 'readline';

import { client } from './database/client';
import { Product } from '../src/interfaces/products';

// Multer could sometimes options
const multerConfig = multer();

const router = Router();

router.post('/products', multerConfig.single('file'),
    async (request: Request, response: Response) => {
    const buffer = request.file?.buffer;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const productLine = readLine.createInterface({
        input: readableFile
    });

    const products: Product[] = [];

    for await (let line of productLine) {
        const productLineSplit = line.split(',');

        products.push({
            code_bar: productLineSplit[0],
            description: productLineSplit[1],
            price: Number(productLineSplit[2]),
            quantity: Number(productLineSplit[3])
        });
    }

    for await (let { code_bar, description, price, quantity } of products) {
        await client.products.create({
            data: {
                code_bar,
                description,
                price,
                quantity
            }
        });
    }

    return response.json({
        'Status': 200,
        'Message': 'Success Save'
    });
});

export {
    router
}