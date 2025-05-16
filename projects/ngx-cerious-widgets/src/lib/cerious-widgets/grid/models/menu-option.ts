import { ColumnDef } from "../interfaces/column-def";

/**
 * Represents a menu option in a grid component.
 */
export class MenuOption {
    /**
     * The label displayed for the menu option.
     */
    label: string;

    /**
     * A callback function executed when the menu option is selected.
     * 
     * @param that - The current instance of the `MenuOption` class.
     * @param column - The column definition associated with the menu option.
     */
    callback: (that: MenuOption, column: ColumnDef) => void;

    /**
     * Creates an instance of `MenuOption`.
     * 
     * @param data - An object containing the initialization data for the menu option.
     * @param data.label - The label for the menu option.
     * @param data.callback - The callback function for the menu option.
     */
    constructor(data: any) {
        this.label = data.label;
        this.callback = data.callback;
    }
}