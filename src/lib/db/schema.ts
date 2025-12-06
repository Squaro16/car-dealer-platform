import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "sales", "service", "viewer"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["in_stock", "reserved", "sold", "hidden"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "test_drive_booked", "won", "lost"]);
export const leadSourceEnum = pgEnum("lead_source", ["website", "whatsapp", "manual", "referral"]);
export const transmissionEnum = pgEnum("transmission", ["automatic", "manual", "cvt", "dct"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "hybrid", "electric", "plug_in_hybrid"]);
export const conditionEnum = pgEnum("condition", ["new", "used", "reconditioned"]);

// Dealers Table (Multi-tenant root)
export const dealers = pgTable("dealers", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(), // For subdomain/path routing
    logoUrl: text("logo_url"),
    address: text("address"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    settings: jsonb("settings").$type<Record<string, any>>().default({}), // Branding, currency, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users Table (Linked to Supabase Auth via id)
export const users = pgTable("users", {
    id: uuid("id").primaryKey(), // Matches Supabase Auth ID
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),
    email: text("email").notNull(),
    name: text("name"),
    role: userRoleEnum("role").default("viewer").notNull(),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vehicles Table
export const vehicles = pgTable("vehicles", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),

    // Identity
    vin: text("vin"),
    stockNumber: text("stock_number"),

    // Basic Info
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    variant: text("variant"),
    bodyType: text("body_type"),

    // Specs
    mileage: integer("mileage").default(0),
    transmission: transmissionEnum("transmission"),
    fuelType: fuelTypeEnum("fuel_type"),
    engineSize: text("engine_size"), // e.g. "2.0L"
    color: text("color"),
    doors: integer("doors"),
    seats: integer("seats"),

    // Financial
    price: decimal("price", { precision: 12, scale: 2 }).notNull(), // Selling price
    costPrice: decimal("cost_price", { precision: 12, scale: 2 }), // Internal cost
    currency: text("currency").default("SGD").notNull(),

    // Status & Condition
    status: vehicleStatusEnum("status").default("in_stock").notNull(),
    condition: conditionEnum("condition").default("used").notNull(),
    isFeatured: boolean("is_featured").default(false),

    // Media
    images: jsonb("images").$type<string[]>().default([]), // Array of image URLs

    // Metadata
    description: text("description"),
    features: jsonb("features").$type<string[]>().default([]), // Array of strings

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdById: uuid("created_by_id").references(() => users.id),
});

// Leads Table
export const leads = pgTable("leads", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),

    // Customer Info
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),

    // Lead Details
    source: leadSourceEnum("source").default("website").notNull(),
    status: leadStatusEnum("status").default("new").notNull(),
    message: text("message"),

    // Relations
    vehicleId: uuid("vehicle_id").references(() => vehicles.id),
    assignedToId: uuid("assigned_to_id").references(() => users.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations Definitions
export const dealersRelations = relations(dealers, ({ many }) => ({
    users: many(users),
    vehicles: many(vehicles),
    leads: many(leads),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    dealer: one(dealers, {
        fields: [users.dealerId],
        references: [dealers.id],
    }),
    assignedLeads: many(leads, { relationName: "assignedTo" }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
    dealer: one(dealers, {
        fields: [vehicles.dealerId],
        references: [dealers.id],
    }),
    leads: many(leads),
    createdBy: one(users, {
        fields: [vehicles.createdById],
        references: [users.id],
    }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
    dealer: one(dealers, {
        fields: [leads.dealerId],
        references: [dealers.id],
    }),
    vehicle: one(vehicles, {
        fields: [leads.vehicleId],
        references: [vehicles.id],
    }),
    assignedTo: one(users, {
        fields: [leads.assignedToId],
        references: [users.id],
        relationName: "assignedTo",
    }),
}));

// Phase 2: Sales & Financials

export const paymentMethodEnum = pgEnum("payment_method", ["cash", "loan", "bank_transfer", "cheque", "other"]);
export const expenseCategoryEnum = pgEnum("expense_category", ["repair", "maintenance", "cleaning", "marketing", "admin", "other"]);

// Customers Table
export const customers = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    idNumber: text("id_number"), // NRIC / Passport
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sales Table
export const sales = pgTable("sales", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id).notNull(),
    customerId: uuid("customer_id").references(() => customers.id).notNull(),
    sellerId: uuid("seller_id").references(() => users.id).notNull(),

    salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(),
    saleDate: timestamp("sale_date").defaultNow().notNull(),
    paymentMethod: paymentMethodEnum("payment_method").default("bank_transfer").notNull(),
    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Expenses Table
export const expenses = pgTable("expenses", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id), // Can be general expense if null, but for now we focus on vehicle expenses

    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    category: expenseCategoryEnum("category").default("other").notNull(),
    description: text("description").notNull(),
    date: timestamp("date").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations for New Tables
export const customersRelations = relations(customers, ({ one, many }) => ({
    dealer: one(dealers, {
        fields: [customers.dealerId],
        references: [dealers.id],
    }),
    sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
    dealer: one(dealers, {
        fields: [sales.dealerId],
        references: [dealers.id],
    }),
    vehicle: one(vehicles, {
        fields: [sales.vehicleId],
        references: [vehicles.id],
    }),
    customer: one(customers, {
        fields: [sales.customerId],
        references: [customers.id],
    }),
    seller: one(users, {
        fields: [sales.sellerId],
        references: [users.id],
    }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    dealer: one(dealers, {
        fields: [expenses.dealerId],
        references: [dealers.id],
    }),
    vehicle: one(vehicles, {
        fields: [expenses.vehicleId],
        references: [vehicles.id],
    }),
}));

// Sourcing Requests Table
export const sourcingRequests = pgTable("sourcing_requests", {
    id: uuid("id").defaultRandom().primaryKey(),
    dealerId: uuid("dealer_id").references(() => dealers.id).notNull(),

    // Customer Detail
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),

    // Vehicle Preferences
    make: text("make").notNull(),
    model: text("model").notNull(),
    yearRange: text("year_range"), // e.g., "2020-2023"
    budget: decimal("budget", { precision: 12, scale: 2 }),
    color: text("color"),
    transmission: transmissionEnum("transmission"),

    // Status
    status: leadStatusEnum("status").default("new").notNull(),
    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sourcingRequestsRelations = relations(sourcingRequests, ({ one }) => ({
    dealer: one(dealers, {
        fields: [sourcingRequests.dealerId],
        references: [dealers.id],
    }),
}));
