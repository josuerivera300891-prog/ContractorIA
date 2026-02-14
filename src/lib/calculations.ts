import { UnitType } from '@/types/domain';

/**
 * Calculates the total line item price based on unit type rules.
 * Rounds to 2 decimal places.
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

    return Number(total.toFixed(2));
}

export function calculateEstimateTotals(items: { total: number }[], taxRate: number = 0) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
}
