
/**
 * Represents the state of filters applied to a grid or dataset.
 * Each field in the object corresponds to a filter configuration for that field.
 */
export interface FilterState {
  [field: string]: {
    /**
     * The type of filter to apply. Supported filter types include:
     * - 'equals': Checks if the value is equal to the specified value.
     * - 'notEqual': Checks if the value is not equal to the specified value.
     * - 'contains': Checks if the value contains the specified substring.
     * - 'notContain': Checks if the value does not contain the specified substring.
     * - 'startsWith': Checks if the value starts with the specified substring.
     * - 'endsWith': Checks if the value ends with the specified substring.
     * - 'greaterThan': Checks if the value is greater than the specified value.
     * - 'greaterThanOrEqual': Checks if the value is greater than or equal to the specified value.
     * - 'lessThan': Checks if the value is less than the specified value.
     * - 'lessThanOrEqual': Checks if the value is less than or equal to the specified value.
     * - 'inRange': Checks if the value is within the specified range.
     * - 'in': Checks if the value is within the specified list of values.
     * - 'notIn': Checks if the value is not within the specified list of values.
     * - 'isNull': Checks if the value is null.
     * - 'isNotNull': Checks if the value is not null.
     * - 'isEmpty': Checks if the value is an empty string or array.
     * - 'isNotEmpty': Checks if the value is not an empty string or array.
     */
    type:
      | 'equals'
      | 'notEqual'
      | 'contains'
      | 'notContain'
      | 'startsWith'
      | 'endsWith'
      | 'greaterThan'
      | 'greaterThanOrEqual'
      | 'lessThan'
      | 'lessThanOrEqual'
      | 'inRange'
      | 'in'
      | 'notIn'
      | 'isNull'
      | 'isNotNull'
      | 'isEmpty'
      | 'isNotEmpty';

    /**
     * The value to use for the filter. This can be a single value or an array of values.
     * Supported types include:
     * - `string`
     * - `number`
     * - `boolean`
     * - `Date`
     */
    value?: string | number | boolean | Date | (string | number | boolean | Date);

    /**
     * An alternative property to specify multiple values for the filter.
     * Supported types include:
     * - `string`
     * - `number`
     * - `boolean`
     * - `Date`
     * - An array of the above types
     */
    values?: string | number | boolean | Date | (string | number | boolean | Date)[];
  };
}