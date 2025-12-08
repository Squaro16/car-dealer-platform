import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
    it('should merge class names correctly', () => {
        const result = cn('text-red-500', 'bg-blue-500');
        expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
        const isActive = true;
        const isError = false;
        const result = cn(
            'base-class',
            isActive && 'active-class',
            isError && 'error-class'
        );
        expect(result).toBe('base-class active-class');
    });

    it('should merge tailwind classes properly using tailwind-merge', () => {
        // tailwind-merge should resolve conflicting classes (e.g., p-4 vs p-2 -> last one wins)
        const result = cn('p-2', 'p-4');
        expect(result).toBe('p-4');
    });
});
