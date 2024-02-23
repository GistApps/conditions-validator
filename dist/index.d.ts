declare enum RuleTypes {
    Any = "any",
    All = "all"
}
declare enum Conditions {
    IsSet = "IS_SET",
    IsNotSet = "IS_NOT_SET",
    Equals = "EQUALS",
    NotEquals = "NOT_EQUALS",
    Contains = "CONTAINS",
    NotContains = "NOT_CONTAINS",
    GreaterThan = "GREATER_THAN",
    LessThan = "LESS_THAN"
}
type Rule = {
    condition: Conditions;
    option: string;
    value: any;
};
type ValidatorConfig = {
    rules: Rule[];
    ruleType: RuleTypes;
    data?: any;
    test?: Function;
};
/**
 * CONDITIONS VALIDATOR
 */
declare const ConditionsValidator: {
    /**
     * The conditions object contains a set of checks that can be run on a given value.
     */
    conditions: {
        NOT_UNDEFINED: (value: any) => boolean;
        NOT_NULL: (value: any) => boolean;
        NOT_EMPTY: (value: string) => boolean;
        NOT_FALSE: (value: boolean) => boolean;
        IS_STRING: (value: any) => boolean;
        IS_NUMBER: (value: any) => boolean;
        IS_ARRAY: (value: any) => boolean;
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
        CONTAINS: (value: any, testValue: any) => boolean;
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
    /**
     * Tests a condition based on the provided value and test value.
     */
    testSingleCondition: (condition: Conditions, value: any, testValue: any) => boolean;
    /**
     * Test a rule against provided JSON data.
     * Recursively traverses nested data to find the option value.
     */
    testJsonData: (rule: Rule, ruleType: RuleTypes, data: any) => boolean;
    /**
     * Validates a single rule condition.
     */
    validateSingleRule: (rule: Rule, ruleType: RuleTypes, data: any, test: Function | undefined) => boolean;
    /**
     * Validates all rules based on the provided ruleType.
     *
     * Config must include rules, ruleType, and ONE of either:
     *   1) @property {object} data - Javascript object containing data passed to the validator's default
     *      validation function, which tests the data against the provided rules.
     *   2) @property {function} test - Custom test function provided to overrides the validator's default
     *      validation function. Params include the rule, ruleType, and a callback to test the rule condition.
     */
    validate: (config: ValidatorConfig) => boolean;
};

export { ConditionsValidator as default };
