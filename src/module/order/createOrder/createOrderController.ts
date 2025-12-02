import { CreateOrderTypeOrmRepository } from "./createOrderTypeOrmRepository";

const express = require('express');
const router = express.Router();
import { Request, Response } from 'express';
import { CreateOrderUseCase } from "./createOrderUseCase";

router.post('/order', async (request: Request, response: Response) => {
    const { productIds, totalPrice } = request.body;

    const createOrderTypeOrmRepository = new CreateOrderTypeOrmRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderTypeOrmRepository);

    try {
        await createOrderUseCase.execute({ productIds, totalPrice });
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({ message: error.message });
        }

        return response.status(500).json({ message: 'Internal server error' });
    }

    return response.status(201).json();
});

module.exports = router;
