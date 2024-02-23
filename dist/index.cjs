var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var ConditionsValidator = {
  /**
   * The conditions object contains a set of checks that can be run on a given value.
   */
  conditions: {
    NOT_UNDEFINED: (value) => {
      return typeof value !== "undefined";
    },
    NOT_NULL: (value) => {
      return value !== null;
    },
    NOT_EMPTY: (value) => {
      return value !== "";
    },
    NOT_FALSE: (value) => {
      return value !== false;
    },
    IS_STRING: (value) => {
      return typeof value === "string";
    },
    IS_NUMBER: (value) => {
      return !isNaN(value);
    },
    IS_ARRAY: (value) => {
      return Array.isArray(value);
    },
    IS_OBJECT: (value) => {
      return ConditionsValidator.conditions.NOT_NULL(value) && typeof value === "object";
    },
    IS_FUNCTION: (value) => {
      return typeof value === "function";
    },
    /**
     * Checks if the value given IS NOT undefined, empty, null or false
     */
    IS_SET: (value) => {
      return ConditionsValidator.conditions.NOT_UNDEFINED(value) && ConditionsValidator.conditions.NOT_NULL(value) && ConditionsValidator.conditions.NOT_EMPTY(value) && ConditionsValidator.conditions.NOT_FALSE(value);
    },
    /**
     * Checks if the value given is undefined, empty, null or false
     */
    IS_NOT_SET: (value) => {
      return !ConditionsValidator.conditions.IS_SET(value);
    },
    /**
     * Checks if the value given is equal to a test value
     */
    EQUALS: (value, testValue) => {
      return ConditionsValidator.conditions.IS_SET(value) && ConditionsValidator.conditions.IS_SET(testValue) && value.toString() === testValue.toString();
    },
    /**
     * Checks if the value given is not equal to a test value
     */
    NOT_EQUALS: (value, testValue) => {
      return !ConditionsValidator.conditions.EQUALS(value, testValue);
    },
    /**
     * Checks if the value given contains a test value
     */
    CONTAINS: (value, testValue) => {
      return ConditionsValidator.conditions.IS_STRING(value) && value.includes(testValue);
    },
    /**
     * Checks if the value given does not contain a test value
     */
    NOT_CONTAINS: (value, testValue) => {
      return !ConditionsValidator.conditions.CONTAINS(value, testValue);
    },
    /**
     * Checks if the value is greater than a test value
     */
    GREATER_THAN: (value, testValue) => {
      return ConditionsValidator.conditions.IS_NUMBER(value) && ConditionsValidator.conditions.IS_NUMBER(testValue) && Number(value) > Number(testValue);
    },
    /**
     * Checks if the value is less than the test value
     */
    LESS_THAN: (value, testValue) => {
      return ConditionsValidator.conditions.IS_NUMBER(value) && ConditionsValidator.conditions.IS_NUMBER(testValue) && Number(value) < Number(testValue);
    }
  },
  /**
   * Tests a condition based on the provided value and test value.
   */
  testSingleCondition: (condition, value, testValue) => {
    return ConditionsValidator.conditions[condition](value, testValue);
  },
  /**
   * Test a rule against provided JSON data.
   * Recursively traverses nested data to find the option value.
   */
  testJsonData: (rule, ruleType, data) => {
    const { condition, option, value: ruleValue } = rule;
    const optionArray = option.split(".");
    const nextLevelDataKey = optionArray.length > 1 ? optionArray.shift() : null;
    if (nextLevelDataKey) {
      const nextLevelData = data[nextLevelDataKey];
      const nextLevelRule = { ...rule, option: optionArray.join(".") };
      return ConditionsValidator.testJsonData(nextLevelRule, ruleType, nextLevelData);
    }
    if (ConditionsValidator.conditions.IS_ARRAY(data)) {
      return ruleType === "any" ? data.some((dataItem) => ConditionsValidator.testJsonData(rule, ruleType, dataItem)) : data.every((dataItem) => ConditionsValidator.testJsonData(rule, ruleType, dataItem));
    }
    const optionData = data[option];
    if (ConditionsValidator.conditions.IS_OBJECT(optionData)) {
      return Object.values(optionData).some(
        (value) => ConditionsValidator.conditions.IS_ARRAY(value) ? value.some((val) => ConditionsValidator.testSingleCondition(condition, val, ruleValue)) : ConditionsValidator.testSingleCondition(condition, value, ruleValue)
      );
    }
    return ConditionsValidator.testSingleCondition(condition, optionData, ruleValue);
  },
  /**
   * Validates a single rule condition.
   */
  validateSingleRule: (rule, ruleType, data, test) => {
    if (!ConditionsValidator.conditions.IS_OBJECT(rule)) {
      console.warn("Rule is invalid: ", rule);
      return false;
    }
    if (typeof test === "function") {
      return test(rule, ruleType, ConditionsValidator.testSingleCondition);
    }
    return ConditionsValidator.testJsonData(rule, ruleType, data);
  },
  /**
   * Validates all rules based on the provided ruleType.
   * 
   * Config must include rules, ruleType, and ONE of either:
   *   1) @property {object} data - Javascript object containing data passed to the validator's default
   *      validation function, which tests the data against the provided rules.
   *   2) @property {function} test - Custom test function provided to overrides the validator's default
   *      validation function. Params include the rule, ruleType, and a callback to test the rule condition.
   */
  validate: (config) => {
    const { rules, ruleType, data, test } = config;
    if (!Array.isArray(rules)) {
      console.warn("Invalid Rules provided to ConditionsValidator: ", rules);
      return false;
    }
    if (!rules.length) {
      return true;
    }
    if (!data && typeof test !== "function") {
      console.warn("ConditionsValidator must be provided either a set of data to test against or a custom test function.");
      return false;
    }
    return ruleType === "any" ? rules.some((rule) => ConditionsValidator.validateSingleRule(rule, ruleType, data, test)) : rules.every((rule) => ConditionsValidator.validateSingleRule(rule, ruleType, data, test));
  }
};
var src_default = ConditionsValidator;
