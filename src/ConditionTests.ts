
const tests = {
  
  NOT_UNDEFINED: (value: any) => {
    return typeof value !== "undefined";
  },
  NOT_NULL: (value: any) => {
    return value !== null;
  },
  NOT_EMPTY: (value: any) => {
    return tests.NOT_NULL(value) && value !== "" && 
    (tests.IS_ARRAY(value) ? value.length > 0 : true) && 
    (tests.IS_OBJECT(value) ? !tests.IS_EMPTY_OBJECT(value) : true)
    ;
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
  /**
   * Thanks to https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/8511350#8511350
   */
  IS_OBJECT: (value: any) => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
  },

  /**
   * Thanks to https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
   */
  IS_EMPTY_OBJECT: (value: any) => {
    
    if (!tests.IS_OBJECT(value)) {
      return false;
    }
  
    const proto = Object.getPrototypeOf(value);
  
    // consider `Object.create(null)`, commonly used as a safe map
    // before `Map` support, an empty object as well as `{}`
    if (proto !== null && proto !== Object.prototype) {
      return false;
    }

    for (const prop in value) {
      if (Object.prototype.hasOwnProperty.call(value, prop)) {
        return false;
      }
    }
  
    return true;
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

    // Test numbers first, as typeof NaN is number will work for string type numbers
    if (tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue)) {
      return Number(value) === Number(testValue);
    }

    // Test this after numbers, as IS_STRING will return fals for floats and integers
    if (tests.IS_STRING(value) && tests.IS_STRING(testValue)) {
      return value.toString() === testValue.toString();
    }

    if (tests.IS_ARRAY(value) && tests.IS_ARRAY(testValue)) {
      return JSON.stringify(value) === JSON.stringify(testValue);
    }

    if (tests.IS_OBJECT(value) && tests.IS_OBJECT(testValue)) {
      return JSON.stringify(value) === JSON.stringify(testValue);
    }

    return value === testValue;

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
    return (
      tests.IS_STRING(value) ||
      tests.IS_ARRAY(value)
    ) && value.includes(testValue);
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