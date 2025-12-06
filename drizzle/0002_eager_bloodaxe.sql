CREATE TABLE "sourcing_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dealer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year_range" text,
	"budget" numeric(12, 2),
	"color" text,
	"transmission" "transmission",
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sourcing_requests" ADD CONSTRAINT "sourcing_requests_dealer_id_dealers_id_fk" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sourcing_requests_dealer_id_idx" ON "sourcing_requests" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "customers_dealer_id_idx" ON "customers" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "dealers_slug_idx" ON "dealers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "expenses_dealer_id_idx" ON "expenses" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "expenses_vehicle_id_idx" ON "expenses" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "leads_dealer_id_idx" ON "leads" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "leads_vehicle_id_idx" ON "leads" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "leads_assigned_to_id_idx" ON "leads" USING btree ("assigned_to_id");--> statement-breakpoint
CREATE INDEX "sales_dealer_id_idx" ON "sales" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "sales_vehicle_id_idx" ON "sales" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "sales_customer_id_idx" ON "sales" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "sales_seller_id_idx" ON "sales" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "users_dealer_id_idx" ON "users" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "vehicles_dealer_id_idx" ON "vehicles" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "vehicles_stock_number_idx" ON "vehicles" USING btree ("stock_number");--> statement-breakpoint
CREATE INDEX "vehicles_make_model_idx" ON "vehicles" USING btree ("make","model");