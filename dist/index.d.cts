/**
 *
 * @copyright     (c) 2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 *
 * /src/types/additional-config.ts
 * Created:       Fri Sep 12 2025
 * Modified By:   Greg Olive
 * Last Modified: Mon Sep 22 2025
 */
type AdditionalConfigInterface = {
    date?: DateConfig;
};
type DateConfig = {
    now?: string;
    timezone: string | null;
    lead_time: number | string;
    cutoff_time: string | null;
    cutoff_time_type: string;
    disabled_dates: string[];
    disallowed_days: string[];
    add_disallowed_to_lead: boolean;
};

/**
 *
 * @copyright     (c) 2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 *
 * /src/types/index.ts
 * Created:       Fri Mar 14 2025
 * Modified By:   Greg Olive
 * Last Modified: Fri Sep 12 2025
 */

type FormConditionInterface = {
    element: string | HTMLElement | NodeList;
    addElementValues?: any[];
    condition: string;
    value: any;
};
type JSONConditionInterface = {
    option: string;
    condition: string;
    value: any;
};
type ConditionInterface = FormConditionInterface | JSONConditionInterface;
type AllOrAnyType = 'all' | 'any';

/**
 *
 * @copyright     (c) 2024-2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 *
 * /src/ConditionTests.ts
 * Created:       Wed Jun 05 2024
 * Modified By:   Greg Olive
 * Last Modified: Mon Sep 22 2025
 */

declare const tests: {
    NOT_UNDEFINED: (value: any) => boolean;
    NOT_NULL: (value: any) => boolean;
    NOT_EMPTY: (value: any) => boolean;
    NOT_FALSE: (value: any) => boolean;
    IS_STRING: (value: any) => boolean;
    IS_NUMBER: (value: any) => boolean;
    IS_ARRAY: (value: any) => boolean;
    /**
     * Thanks to https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/8511350#8511350
     */
    IS_OBJECT: (value: any) => boolean;
    /**
     * Thanks to https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
     */
    IS_EMPTY_OBJECT: (value: any) => boolean;
    IS_FUNCTION: (value: any) => boolean;
    /**
     * Checks if the value given IS NOT undefined, empty, null or false
     */
    IS_SET: (value: any) => boolean;
    /**
     * Checks if the value given is undefined, empty, null or false
     */
    IS_NOT_SET: (value: any) => boolean;
    /**
     * Checks if the value given is equal to a test value
     */
    EQUALS: (value: any, testValue: any) => boolean;
    /**
     * Checks if the value given is not equal to a test value
     */
    NOT_EQUALS: (value: any, testValue: any) => boolean;
    /**
     * Checks if the value given contains a test value
     */
    CONTAINS: (value: any, testValue: any) => any;
    /**
     * Checks if the value given does not contain a test value
     */
    NOT_CONTAINS: (value: any, testValue: any) => boolean;
    /**
     * Checks if the value is greater than a test value
     */
    GREATER_THAN: (value: any, testValue: any) => boolean;
    /**
     * Checks if the value is less than the test value
     */
    LESS_THAN: (value: any, testValue: any) => boolean;
    /**
     * Converts the date value to a lead time in days to NOW,
     * then checks if the lead time is greater than the test value.
     */
    GREATER_THAN_DATE_NOW: (value: any, testValue: any, config: AdditionalConfigInterface) => boolean;
    /**
     * Converts the date value to a lead time in days to NOW,
     * then checks if the lead time is less than the test value.
     */
    LESS_THAN_DATE_NOW: (value: any, testValue: any, config: AdditionalConfigInterface) => boolean;
    /**
     * Converts the date value to a lead time in days to the FIRST AVAILABLE date,
     * then checks if the lead time is greater than the test value.
     */
    GREATER_THAN_DATE_FIRST: (value: any, testValue: any, config: AdditionalConfigInterface) => boolean;
    /**
     * Converts the date value to a lead time in days to the FIRST AVAILABLE date,
     * then checks if the lead time is less than the test value.
     */
    LESS_THAN_DATE_FIRST: (value: any, testValue: any, config: AdditionalConfigInterface) => boolean;
};

interface ConditionCheckerInterface {
    conditions: Array<ConditionInterface>;
    allOrAny: AllOrAnyType;
    /**
     * Check all conditions, and return true if all are met if allOrAny is 'all',
     * or if any are met if allOrAny is 'any'
     */
    check(): boolean;
    /**
     * Get the value from the HTML or JSON element
     * @param element
     */
    getValue(element: string): any;
    /**
     * Compare a single condition
     * @param value
     * @param condition
     * @param conditionValue
     */
    compare(value: any, condition: string, conditionValue: any): boolean;
}

/**
 *
 * @copyright     (c) 2024-2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 *
 * /src/JsonConditionChecker.ts
 * Created:       Fri Nov 01 2024
 * Modified By:   Greg Olive
 * Last Modified: Fri Sep 12 2025
 */

declare abstract class JsonConditionChecker implements ConditionCheckerInterface {
    conditions: Array<JSONConditionInterface>;
    allOrAny: AllOrAnyType;
    json: any;
    config?: AdditionalConfigInterface;
    constructor(conditions: Array<JSONConditionInterface>, allOrAny: AllOrAnyType, json: any, config?: AdditionalConfigInterface);
    /**
     * Validation config is set up in dot notation to match the form html structure
     * @param {*} obj
     * @param {*} path
     * @returns
     */
    getValueFromDotNotation: (obj: any, path: string) => any;
    /**
     * @inheritdoc
     */
    getValue: (element: string) => any;
    compareEach: (value: any[], condition: string, conditionValue: any) => boolean;
    /**
     * @inheritdoc
     */
    compare: (value: any, condition: string, conditionValue: any) => boolean;
    /**
     * @inheritdoc
     */
    check: () => boolean;
}

declare abstract class FormConditionChecker implements ConditionCheckerInterface {
    conditions: Array<FormConditionInterface>;
    allOrAny: AllOrAnyType;
    constructor(conditions: Array<FormConditionInterface>, allOrAny: AllOrAnyType);
    /**
     * Get an array of the elements values to compare. Could be one or more element values.
     * @param element
     * @param addElementValues
     * @returns {Array<any>}
     */
    getElementValues: (element: string | HTMLElement | NodeList, addElementValues?: any[]) => any[];
    /**
     * @inheritdoc
     */
    getValue: (element: string | HTMLElement | Node | NodeList) => any;
    compareEach: (value: any[], condition: string, conditionValue: any) => boolean;
    /**
     * @inheritdoc
     */
    compare: (value: any, condition: string, conditionValue: any) => boolean;
    /**
     * @inheritdoc
     */
    check: () => boolean;
}

export { tests as ConditionTests, FormConditionChecker, JsonConditionChecker };
