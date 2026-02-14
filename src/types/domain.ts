export type UnitType = 'sqft' | 'hour' | 'day' | 'unit' | 'fixed';

export type EstimateStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'APPROVED' | 'SIGNED' | 'REJECTED';

export interface Company {
    id: string; // tenant_id
    name: string;
    slug: string;
    created_at: string;
    logo_url?: string;
    settings: {
        currency: string;
        tax_rate: number;
        address: string;
    };
}

export interface Client {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export interface LineItem {
    id: string;
    description: string;
    unit_type: UnitType;
    quantity: number;
    rate: number;
    total: number; // Calculated: quantity * rate (or just rate if fixed)
}

export interface Estimate {
    id: string;
    company_id: string;
    client_id: string;
    number: string; // Friendly ID like EST-001
    version: number;
    status: EstimateStatus;
    date_issued: string;
    date_expires?: string;
    items: LineItem[];
    subtotal: number;
    tax_rate?: number;
    tax_amount: number;
    total: number;
    deposit_amount: number;
    balance_due: number; // total - deposit_amount
    notes?: string;
    signature_id?: string; // If status === SIGNED
    created_at: string;
    updated_at: string;
    created_by: string; // User UUID
}

export interface Signature {
    id: string;
    estimate_id: string;
    signer_name: string;
    signer_email: string;
    signature_asset_url: string; // Secure storage path
    ip_address: string;
    user_agent: string;
    signed_at: string;
    document_hash: string; // Integrity verification
}

export interface Deposit {
    id: string;
    estimate_id: string;
    company_id: string;
    amount: number;
    method: 'STRIPE' | 'MANUAL' | 'CHECK' | 'CASH';
    status: 'PENDING' | 'PAID' | 'FAILED';
    transaction_id?: string;
    paid_at?: string;
}
