// Tests form primitives to ensure labels, descriptions, and messages wire up aria props.
// Confirms validation errors surface via FormMessage with correct connections.
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "./form";

interface TestValues {
    name: string;
}

function TestForm({ onSubmit }: { onSubmit?: (values: TestValues) => void }) {
    const form = useForm<TestValues>({
        defaultValues: { name: "" },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => {
                    onSubmit?.(values);
                })}
            >
                <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <input
                                    data-testid="name-input"
                                    placeholder="Enter name"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Use the customer&apos;s full name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button type="submit">Submit</button>
            </form>
        </Form>
    );
}

describe("Form primitives", () => {
    it("links label and control for accessibility", () => {
        render(<TestForm />);

        const input = screen.getByLabelText("Name");
        expect(input).toBeInTheDocument();
        expect(input.getAttribute("aria-invalid")).toBe("false");
        expect(input.getAttribute("aria-describedby")).toContain("form-item-description");
    });

    it("shows validation message and updates aria when required field is empty", async () => {
        render(<TestForm />);

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        const message = await screen.findByText("Name is required");
        expect(message).toBeInTheDocument();

        const input = screen.getByLabelText("Name");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-describedby")).toContain("form-item-message");
    });
});

