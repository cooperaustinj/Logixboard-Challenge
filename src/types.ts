export type Organization = {
    id: string;
    code: string;
};

export type Shipment = {
    referenceId: string;
    estimatedTimeArrival: string;
    organizations: string[];
    transportPacks: { nodes: TransportPack[] };
};

export enum WeightUnit {
    KILOGRAMS = 'KILOGRAMS',
    POUNDS = 'POUNDS',
    OUNCES = 'OUNCES',
};

export type TransportPack = {
    totalWeight: {
        weight: string;
        unit: WeightUnit;
    };
};
