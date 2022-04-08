require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = 3000;

import * as OrganizationRepo from './data/organization-repo';
import * as ShipmentRepo from './data/shipment-repo';
import { Organization, Shipment } from './types';

app.post('/shipment', async (req: any, res: any) => {
    const model: Shipment = {
        referenceId: req.body.referenceId,
        estimatedTimeArrival: req.body.estimatedTimeArrival,
        organizations: req.body.organizations,
        transportPacks: req.body.transportPacks,
    };
    await ShipmentRepo.save(model);
    return res.status(200).send({ status: 'success' });
});

app.post('/organization', async (req: any, res: any) => {
    const model: Organization = {
        id: req.body.id,
        code: req.body.code,
    };
    await OrganizationRepo.save(model);
    return res.status(200).send({ status: 'success' });
});

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
    const result = await ShipmentRepo.get(req.params.shipmentId);
    return res.send(result);
});

app.get('/organizations/:organizationId', async (req: any, res: any) => {
    const result = await OrganizationRepo.get(req.params.organizationId);
    return res.send(result);
});

app.get('/aggregate-weight/:unit', async (req: any, res: any) => {
    const result = await ShipmentRepo.getAggregateWeight(req.params.unit.toUpperCase());
    return res.send({ result: result });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
