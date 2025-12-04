import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Order } from '../../Order';
import { buildApp } from '../../../../config/app';
import request from 'supertest';
import { Express } from 'express';

describe('US-1 : Créer une commande - E2E', () => {
    let container: StartedPostgreSqlContainer;
    let dataSource: DataSource;
    let app: Express;

    beforeAll(async () => {
        container = await new PostgreSqlContainer('postgres:16')
            .withExposedPorts(5432)
            .start();

        dataSource = new DataSource({
            type: 'postgres',
            host: container.getHost(),
            port: container.getPort(),
            username: container.getUsername(),
            password: container.getPassword(),
            database: container.getDatabase(),
            logging: false,
            entities: [Order],
            synchronize: true,
            entitySkipConstructor: true
        });

        await dataSource.initialize();

        const AppDataSource = require('../../../../config/db.config').default;

        app = buildApp();

        Object.assign(AppDataSource, dataSource);
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
        if (container) {
            await container.stop();
        }
    });

    test('Scénario 1 : création réussie', async () => {
        await dataSource.getRepository(Order).clear();

        const response = await request(app)
            .post('/api/order')
            .send({
                productIds: [1, 2, 3],
                totalPrice: 120
            })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);
        const orders = await dataSource.getRepository(Order).find();
        expect(orders).toHaveLength(1);
        expect(orders[0].productIds.map(Number)).toEqual([1, 2, 3]);
        expect(orders[0].totalPrice).toBe(120);
        expect(orders[0].status).toBe('PENDING');
    });

    test('Scénario 2 : création échouée - trop de produits (>5)', async () => {
        await dataSource.getRepository(Order).clear();

        const response = await request(app)
            .post('/api/order')
            .send({
                productIds: [1,2,3,4,5,6], // 6 produits
                totalPrice: 200
            })
            .set('Content-Type', 'application/json');
        console.log(response.status);
        console.log(response.body.message);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Une commande ne peut contenir plus de 5 produits");

        const orders = await dataSource.getRepository(Order).find();
        expect(orders).toHaveLength(0);
    });

    test('Scénario 3 : création échouée - totalPrice trop faible', async () => {
        await dataSource.getRepository(Order).clear();

        const response = await request(app)
            .post('/api/order')
            .send({
                productIds: [1],
                totalPrice: 1
            })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Le prix total doit être supérieur ou égal à 2€");
        const orders = await dataSource.getRepository(Order).find();
        expect(orders).toHaveLength(0);
    });

});
