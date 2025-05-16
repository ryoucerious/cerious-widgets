/**
 * Represents pagination information for a grid or list.
 * 
 * @interface PagerInfo
 * 
 * @property {number} start - The starting index of the current page.
 * @property {number} end - The ending index of the current page.
 * @property {number} total - The total number of items available.
 */
export interface PagerInfo {
    start: number;
    end: number;
    total: number;
}