import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByRole('button', { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button.className).toContain('bg-destructive');
    });

    it('supports asChild prop', () => {
        // When asChild is true, it renders the child element (Slot)
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        // Should be an anchor tag, not a button
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeDefined();
        expect(link.getAttribute('href')).toBe('/test');
    });
});
