-- =====================================================
-- INVOICE PAYMENTS TABLE (para pagos parciales)
-- =====================================================
CREATE TABLE IF NOT EXISTS invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('STRIPE', 'MANUAL', 'CASH', 'CHECK', 'TRANSFER')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    notes TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para invoice_payments
CREATE INDEX IF NOT EXISTS idx_invoice_payments_invoice_id ON invoice_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_company_id ON invoice_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_status ON invoice_payments(status);

-- RLS para invoice_payments
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view payments from own company" ON invoice_payments;
CREATE POLICY "Users can view payments from own company" ON invoice_payments
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert payments for own company" ON invoice_payments;
CREATE POLICY "Users can insert payments for own company" ON invoice_payments
    FOR INSERT WITH CHECK (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update payments from own company" ON invoice_payments;
CREATE POLICY "Users can update payments from own company" ON invoice_payments
    FOR UPDATE USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

-- =====================================================
-- FUNCIÓN: Recalcular balance de factura
-- =====================================================
CREATE OR REPLACE FUNCTION recalculate_invoice_balance()
RETURNS TRIGGER AS $$
DECLARE
    total_paid DECIMAL(10,2);
    invoice_total DECIMAL(10,2);
    new_balance DECIMAL(10,2);
    new_status TEXT;
BEGIN
    -- Calcular total pagado de pagos completados
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM invoice_payments
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
    AND status = 'COMPLETED';

    -- Obtener total de la factura
    SELECT total INTO invoice_total
    FROM invoices
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);

    -- Calcular nuevo balance
    new_balance := invoice_total - total_paid;

    -- Determinar nuevo status
    IF new_balance <= 0 THEN
        new_status := 'PAID';
        new_balance := 0;
    ELSIF total_paid > 0 THEN
        new_status := 'PARTIAL';
    ELSE
        new_status := 'UNPAID';
    END IF;

    -- Actualizar factura
    UPDATE invoices
    SET
        amount_paid = total_paid,
        balance_due = new_balance,
        status = new_status,
        updated_at = now()
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para recalcular balance automáticamente
DROP TRIGGER IF EXISTS recalculate_invoice_balance_trigger ON invoice_payments;
CREATE TRIGGER recalculate_invoice_balance_trigger
    AFTER INSERT OR UPDATE OR DELETE ON invoice_payments
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_invoice_balance();
