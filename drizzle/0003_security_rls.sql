-- Enable RLS on all tables
ALTER TABLE "dealers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vehicles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sourcing_requests" ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's dealer_id
-- Uses SECURITY DEFINER to bypass RLS recursion on the users table lookup
CREATE OR REPLACE FUNCTION get_my_dealer_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT dealer_id FROM users WHERE id = auth.uid()
$$;

-- Dealers: Users can view their own dealer
CREATE POLICY "enable_select_for_own_dealer" ON "dealers"
    FOR SELECT USING (id = get_my_dealer_id());

-- Users: Users can view their own profile and colleagues
CREATE POLICY "enable_read_for_dealers_users" ON "users"
    FOR SELECT USING (dealer_id = get_my_dealer_id());

CREATE POLICY "enable_update_for_own_profile" ON "users"
    FOR UPDATE USING (auth.uid() = id);

-- Vehicles
CREATE POLICY "enable_all_access_for_dealer_vehicles" ON "vehicles"
    FOR ALL USING (dealer_id = get_my_dealer_id());

-- Leads
CREATE POLICY "enable_all_access_for_dealer_leads" ON "leads"
    FOR ALL USING (dealer_id = get_my_dealer_id());

-- Customers
CREATE POLICY "enable_all_access_for_dealer_customers" ON "customers"
    FOR ALL USING (dealer_id = get_my_dealer_id());

-- Sales
CREATE POLICY "enable_all_access_for_dealer_sales" ON "sales"
    FOR ALL USING (dealer_id = get_my_dealer_id());

-- Expenses
CREATE POLICY "enable_all_access_for_dealer_expenses" ON "expenses"
    FOR ALL USING (dealer_id = get_my_dealer_id());

-- Sourcing Requests
CREATE POLICY "enable_all_access_for_dealer_sourcing_requests" ON "sourcing_requests"
    FOR ALL USING (dealer_id = get_my_dealer_id());
