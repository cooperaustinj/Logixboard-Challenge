import { WeightUnit } from '../types';

const POUND_PER_KILO: number = 0.453592;
const OUNCE_PER_KILO: number = 0.028349;

export function weightToGrams(weight: string, unit: WeightUnit) {
    const nWeight = parseInt(weight);
    switch (unit) {
        case WeightUnit.KILOGRAMS:
            return nWeight;
        case WeightUnit.POUNDS:
            return nWeight * POUND_PER_KILO;
        case WeightUnit.OUNCES:
            return nWeight * OUNCE_PER_KILO;
        default:
            throw new Error(`Unrecognized unit type: ${unit}`);
    }
}

export function convertKilos(kilos: number, unit: string) {
    switch (unit) {
        case WeightUnit.KILOGRAMS:
            return kilos;
        case WeightUnit.POUNDS:
            return kilos / POUND_PER_KILO;
        case WeightUnit.OUNCES:
            return kilos / OUNCE_PER_KILO;
        default:
            throw new Error(`Unrecognized unit type: ${unit}`);
    }
}
