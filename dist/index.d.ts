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
};

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

declare abstract class JsonConditionChecker implements ConditionCheckerInterface {
    conditions: Array<JSONConditionInterface>;
    allOrAny: AllOrAnyType;
    json: any;
    constructor(conditions: Array<JSONConditionInterface>, allOrAny: AllOrAnyType, json: any);
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
    compareEach: (value: any, condition: string, conditionValue: any) => boolean;
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
    compareEach: (value: any, condition: string, conditionValue: any) => boolean;
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
