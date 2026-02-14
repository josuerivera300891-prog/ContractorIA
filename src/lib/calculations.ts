import { UnitType } from '@/types/domain';

/**
 * Rounds a number to exactly 2 decimal places using fixed precision.
 */
export function round2(num: number): number {
    return Number(Math.round(Number(num + 'e2')) + 'e-2');
}

/**
 * Calculates the total line item price based on unit type rules.
 */
export function calculateLineItemTotal(
    quantity: number,
    rate: number,
    unitType: UnitType
): number {
    let total = 0;

    switch (unitType) {
        case 'sqft':
        case 'hour':
        case 'day':
        case 'unit':
            total = quantity * rate;
            break;
        case 'fixed':
            total = rate;
            break;
        default:
            throw new Error(`Unknown unit type: ${unitType}`);
    }

    return round2(total);
}

/**
 * Calculates subtotals, taxes, and totals for an estimate.
 */
export function calculateEstimateTotals(items: { total: number }[], taxRate: number = 0) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return {
        subtotal: round2(subtotal),
        taxAmount: round2(taxAmount),
        total: round2(total),
    };
}

/**
 * Calculates the deposit amount based on type and value.
 */
export function calculateDeposit(total: number, type: 'PERCENT' | 'FIXED' | 'NONE', value: number): number {
    if (type === 'PERCENT') {
        return round2(total * (value / 100));
    }
    if (type === 'FIXED') {
        return round2(value);
    }
    return 0;
}
