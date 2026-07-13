/**
 * Pure scroll lock counter logic — no DOM dependency.
 * Used for property-based testing of the scroll lock balance invariant.
 */

/**
 * Creates an isolated scroll lock counter instance.
 * @returns {{ lock: () => void, unlock: () => void, count: number }}
 */
export function createScrollLock() {
    const sl = {
        count: 0,
        lock() {
            sl.count++;
        },
        unlock() {
            sl.count = Math.max(0, sl.count - 1);
        },
    };
    return sl;
}
