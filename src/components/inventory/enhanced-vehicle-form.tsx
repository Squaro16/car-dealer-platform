"use client";

// Admin vehicle form with make selection, validation, and media uploads.

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form-field";
import { ImageUpload } from "@/components/inventory/image-upload";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";
import { getMakesForSelect } from "@/lib/actions/makes";
import { vehicleSchema } from "@/lib/validations/vehicle";
import { useFormValidation } from "@/hooks/use-form-validation";
import { notify } from "@/lib/utils/notifications";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EnhancedVehicleFormProps {
  initialData?: {
    id: string;
    makeId: string;
    make?: string; // Keep for backward compatibility
    model: string;
    year: number;
    price: string;
    mileage: number;
    status: string;
    condition: string;
    images: string[];
    vin?: string | null;
    stockNumber?: string | null;
    costPrice?: string | null;
    color?: string | null;
    engineSize?: string | null;
    transmission?: string | null;
    fuelType?: string | null;
    doors?: number | null;
    seats?: number | null;
    bodyType?: string | null;
    variant?: string | null;
    description?: string | null;
    features?: string[] | null;
  };
}

const vehicleStatusOptions = [
  { value: "in_stock", label: "In Stock" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "hidden", label: "Hidden" },
];

const vehicleConditionOptions = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "reconditioned", label: "Reconditioned" },
];

const transmissionOptions = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT" },
  { value: "dct", label: "DCT" },
];

const fuelTypeOptions = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "plug_in_hybrid", label: "Plug-in Hybrid" },
];

export default function EnhancedVehicleForm({ initialData }: EnhancedVehicleFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [featuresInput, setFeaturesInput] = useState(
    initialData?.features?.join(", ") || ""
  );
  const [makes, setMakes] = useState<Array<{ value: string; label: string; country: string | null }>>([]);
  const [makesLoading, setMakesLoading] = useState(true);

  // Fetch makes data
  useEffect(() => {
    async function fetchMakes() {
      try {
        const result = await getMakesForSelect();
        if (result.success) {
          setMakes(result.data);
        } else {
          console.error("Failed to fetch makes:", result.error);
        }
      } catch (error) {
        console.error("Error fetching makes:", error);
      } finally {
        setMakesLoading(false);
      }
    }

    fetchMakes();
  }, []);

  const {
    values,
    errors,
    touched,
    validating,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: {
      makeId: initialData?.makeId || initialData?.make || "",
      model: initialData?.model || "",
      year: initialData?.year || new Date().getFullYear(),
      price: initialData?.price ? Number(initialData.price) : 0,
      mileage: initialData?.mileage || 0,
      status: (initialData?.status as "in_stock" | "reserved" | "sold" | "hidden") || "in_stock",
      condition: (initialData?.condition as "new" | "used" | "reconditioned") || "used",
      vin: initialData?.vin || "",
      stockNumber: initialData?.stockNumber || "",
      costPrice: initialData?.costPrice ? Number(initialData.costPrice) : undefined,
      color: initialData?.color || "",
      engineSize: initialData?.engineSize || "",
      transmission: (initialData?.transmission as "automatic" | "manual" | "cvt" | "dct" | undefined) || undefined,
      fuelType: (initialData?.fuelType as "petrol" | "diesel" | "hybrid" | "electric" | "plug_in_hybrid" | undefined) || undefined,
      doors: initialData?.doors ?? undefined,
      seats: initialData?.seats ?? undefined,
      bodyType: initialData?.bodyType || "",
      variant: initialData?.variant || "",
      description: initialData?.description || "",
    },
    validationSchema: vehicleSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleFormSubmit = useCallback(async (formValues: typeof values) => {
    try {
      const formData = new FormData();
      const selectedMakeName = makes.find((item) => item.value === formValues.makeId)?.label || initialData?.make || "";

      // Add all form values
      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });

      // Add images
      formData.set("images", JSON.stringify(images));

      // Add features
      const featuresArray = featuresInput
        .split(",")
        .map(f => f.trim())
        .filter(f => f !== "");
      formData.set("features", JSON.stringify(featuresArray));

      if (initialData) {
        await updateVehicle(initialData.id, formData);
        notify.vehicleUpdated(selectedMakeName, formValues.model);
      } else {
        await createVehicle(formData);
        notify.vehicleAdded(selectedMakeName, formValues.model);
      }

      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      notify.operationFailed(
        initialData ? "Vehicle update" : "Vehicle creation",
        "Please check your input and try again."
      );
    }
  }, [images, featuresInput, initialData, router]);

  const handleSubmitClick = useCallback(() => {
    handleSubmit(handleFormSubmit);
  }, [handleSubmit, handleFormSubmit]);

  const isFormValid = isValid && images.length > 0;
  const isLoading = isSubmitting || Object.values(validating).some(v => v);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {initialData ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
            <p className="text-muted-foreground">
              {initialData
                ? "Update vehicle information and details"
                : "Enter vehicle details to add to your inventory"
              }
            </p>
          </div>
        </div>
      </div>

      <form className="space-y-8">
        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              defaultImages={images}
              onUploadComplete={setImages}
            />
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                At least one image is required
              </p>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                label="VIN"
                name="vin"
                type="text"
                placeholder="Vehicle Identification Number"
                value={values.vin}
                onChange={(value) => handleChange("vin", value)}
                onBlur={() => handleBlur("vin")}
                error={touched.vin ? errors.vin : undefined}
                success={touched.vin && !errors.vin}
                required
                description="17-character vehicle identification number"
                loading={validating.vin}
              />

              <FormField
                label="Stock Number"
                name="stockNumber"
                type="text"
                placeholder="e.g. STK-001"
                value={values.stockNumber}
                onChange={(value) => handleChange("stockNumber", value)}
                onBlur={() => handleBlur("stockNumber")}
                error={touched.stockNumber ? errors.stockNumber : undefined}
                success={touched.stockNumber && !errors.stockNumber}
                description="Internal stock reference number"
                loading={validating.stockNumber}
              />

              <FormField
                label="Year"
                name="year"
                type="number"
                placeholder="2024"
                value={values.year}
                onChange={(value) => handleChange("year", parseInt(value) || "")}
                onBlur={() => handleBlur("year")}
                error={touched.year ? errors.year : undefined}
                success={touched.year && !errors.year}
                required
                min={1900}
                max={new Date().getFullYear() + 1}
                loading={validating.year}
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Make"
                name="makeId"
                type="select"
                placeholder={makesLoading ? "Loading manufacturers..." : "Select manufacturer"}
                options={makes.map(make => ({ value: make.value, label: `${make.label} (${make.country})` }))}
                value={values.makeId}
                onChange={(value) => handleChange("makeId", value)}
                onBlur={() => handleBlur("makeId")}
                error={touched.makeId ? errors.makeId : undefined}
                success={touched.makeId && !errors.makeId}
                required
                loading={validating.makeId || makesLoading}
                disabled={makesLoading}
              />

              <FormField
                label="Model"
                name="model"
                type="text"
                placeholder="Camry"
                value={values.model}
                onChange={(value) => handleChange("model", value)}
                onBlur={() => handleBlur("model")}
                error={touched.model ? errors.model : undefined}
                success={touched.model && !errors.model}
                required
                loading={validating.model}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Variant"
                name="variant"
                type="text"
                placeholder="LE, XLE, etc."
                value={values.variant}
                onChange={(value) => handleChange("variant", value)}
                onBlur={() => handleBlur("variant")}
                error={touched.variant ? errors.variant : undefined}
                success={touched.variant && !errors.variant}
                loading={validating.variant}
              />

              <FormField
                label="Body Type"
                name="bodyType"
                type="text"
                placeholder="Sedan, SUV, etc."
                value={values.bodyType}
                onChange={(value) => handleChange("bodyType", value)}
                onBlur={() => handleBlur("bodyType")}
                error={touched.bodyType ? errors.bodyType : undefined}
                success={touched.bodyType && !errors.bodyType}
                loading={validating.bodyType}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Selling Price"
                name="price"
                type="number"
                placeholder="50000"
                value={values.price}
                onChange={(value) => handleChange("price", value)}
                onBlur={() => handleBlur("price")}
                error={touched.price ? errors.price : undefined}
                success={touched.price && !errors.price}
                required
                min={0}
                description="Price in SGD"
                loading={validating.price}
              />

              <FormField
                label="Cost Price"
                name="costPrice"
                type="number"
                placeholder="40000"
                value={values.costPrice}
                onChange={(value) => handleChange("costPrice", value)}
                onBlur={() => handleBlur("costPrice")}
                error={touched.costPrice ? errors.costPrice : undefined}
                success={touched.costPrice && !errors.costPrice}
                min={0}
                description="Internal cost price"
                loading={validating.costPrice}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Condition */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Status"
                name="status"
                type="select"
                options={vehicleStatusOptions}
                value={values.status}
                onChange={(value) => handleChange("status", value)}
                onBlur={() => handleBlur("status")}
                error={touched.status ? errors.status : undefined}
                success={touched.status && !errors.status}
                required
                loading={validating.status}
              />

              <FormField
                label="Condition"
                name="condition"
                type="select"
                options={vehicleConditionOptions}
                value={values.condition}
                onChange={(value) => handleChange("condition", value)}
                onBlur={() => handleBlur("condition")}
                error={touched.condition ? errors.condition : undefined}
                success={touched.condition && !errors.condition}
                required
                loading={validating.condition}
              />
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                label="Mileage"
                name="mileage"
                type="number"
                placeholder="50000"
                value={values.mileage}
                onChange={(value) => handleChange("mileage", parseInt(value) || 0)}
                onBlur={() => handleBlur("mileage")}
                error={touched.mileage ? errors.mileage : undefined}
                success={touched.mileage && !errors.mileage}
                min={0}
                description="Kilometers driven"
                loading={validating.mileage}
              />

              <FormField
                label="Color"
                name="color"
                type="text"
                placeholder="White Pearl"
                value={values.color}
                onChange={(value) => handleChange("color", value)}
                onBlur={() => handleBlur("color")}
                error={touched.color ? errors.color : undefined}
                success={touched.color && !errors.color}
                loading={validating.color}
              />

              <FormField
                label="Engine Size"
                name="engineSize"
                type="text"
                placeholder="2.0L"
                value={values.engineSize}
                onChange={(value) => handleChange("engineSize", value)}
                onBlur={() => handleBlur("engineSize")}
                error={touched.engineSize ? errors.engineSize : undefined}
                success={touched.engineSize && !errors.engineSize}
                loading={validating.engineSize}
              />

              <FormField
                label="Transmission"
                name="transmission"
                type="select"
                options={transmissionOptions}
                value={values.transmission}
                onChange={(value) => handleChange("transmission", value)}
                onBlur={() => handleBlur("transmission")}
                error={touched.transmission ? errors.transmission : undefined}
                success={touched.transmission && !errors.transmission}
                loading={validating.transmission}
              />

              <FormField
                label="Fuel Type"
                name="fuelType"
                type="select"
                options={fuelTypeOptions}
                value={values.fuelType}
                onChange={(value) => handleChange("fuelType", value)}
                onBlur={() => handleBlur("fuelType")}
                error={touched.fuelType ? errors.fuelType : undefined}
                success={touched.fuelType && !errors.fuelType}
                loading={validating.fuelType}
              />

              <FormField
                label="Doors"
                name="doors"
                type="number"
                placeholder="4"
                value={values.doors}
                onChange={(value) => handleChange("doors", parseInt(value) || "")}
                onBlur={() => handleBlur("doors")}
                error={touched.doors ? errors.doors : undefined}
                success={touched.doors && !errors.doors}
                min={1}
                max={10}
                loading={validating.doors}
              />

              <FormField
                label="Seats"
                name="seats"
                type="number"
                placeholder="5"
                value={values.seats}
                onChange={(value) => handleChange("seats", parseInt(value) || "")}
                onBlur={() => handleBlur("seats")}
                error={touched.seats ? errors.seats : undefined}
                success={touched.seats && !errors.seats}
                min={1}
                max={20}
                loading={validating.seats}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description & Features */}
        <Card>
          <CardHeader>
            <CardTitle>Description & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              placeholder="Detailed vehicle description..."
              value={values.description}
              onChange={(value) => handleChange("description", value)}
              onBlur={() => handleBlur("description")}
              error={touched.description ? errors.description : undefined}
              success={touched.description && !errors.description}
              rows={4}
              description="Detailed description of the vehicle"
              loading={validating.description}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Features
              </label>
              <textarea
                placeholder="Enter features separated by commas (e.g. Air Conditioning, Navigation, Leather Seats)"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple features with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/inventory">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button
            type="button"
            onClick={handleSubmitClick}
            disabled={!isFormValid || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSubmitting ? "Saving..." : "Validating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData ? "Update Vehicle" : "Create Vehicle"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
