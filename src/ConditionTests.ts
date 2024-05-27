
const tests = {
  
  NOT_UNDEFINED: (value: any) => {
    return typeof value !== "undefined";
  },
  NOT_NULL: (value: any) => {
    return value !== null;
  },
  NOT_EMPTY: (value: any) => {
    return value !== "";
  },
  NOT_FALSE: (value: any) => {
    return value !== false;
  },
  IS_STRING: (value: any) => {
    return typeof value === "string";
  },
  IS_NUMBER: (value: any) => {
    return !isNaN(value);
  },
  IS_ARRAY: (value: any) => {
    return Array.isArray(value);
  },
  IS_OBJECT: (value: any) => {
    return tests.NOT_NULL(value) && typeof value === "object";
  },
  IS_FUNCTION: (value: any) => {
    return typeof value === "function";
  },
  /**
   * Checks if the value given IS NOT undefined, empty, null or false
   */
  IS_SET: (value: any) => {
    return tests.NOT_UNDEFINED(value) && tests.NOT_NULL(value) && tests.NOT_EMPTY(value) && tests.NOT_FALSE(value);
  },
  /**
   * Checks if the value given is undefined, empty, null or false
   */
  IS_NOT_SET: (value: any) => {
    return !tests.IS_SET(value);
  },
  /**
   * Checks if the value given is equal to a test value
   */
  EQUALS: (value: any, testValue: any) => {
    return tests.IS_SET(value) && tests.IS_SET(testValue) && value.toString() === testValue.toString();
  },
  /**
   * Checks if the value given is not equal to a test value
   */
  NOT_EQUALS: (value: any, testValue: any) => {
    return !tests.EQUALS(value, testValue);
  },
  /**
   * Checks if the value given contains a test value
   */
  CONTAINS: (value: any, testValue: any) => {
    return tests.IS_STRING(value) && value.includes(testValue);
  },
  /**
   * Checks if the value given does not contain a test value
   */
  NOT_CONTAINS: (value: any, testValue: any) => {
    return !tests.CONTAINS(value, testValue);
  },
  /**
   * Checks if the value is greater than a test value
   */
  GREATER_THAN: (value: any, testValue: any) => {
    return tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue) && Number(value) > Number(testValue);
  },
  /**
   * Checks if the value is less than the test value
   */
  LESS_THAN: (value: any, testValue: any) => {
    return tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue) && Number(value) < Number(testValue);
  }
};

export default tests;