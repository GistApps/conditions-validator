// src/ConditionTests.ts
var tests = {
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
    return tests.NOT_NULL(value) && typeof value === "object";
  },
  IS_FUNCTION: (value) => {
    return typeof value === "function";
  },
  /**
   * Checks if the value given IS NOT undefined, empty, null or false
   */
  IS_SET: (value) => {
    return tests.NOT_UNDEFINED(value) && tests.NOT_NULL(value) && tests.NOT_EMPTY(value) && tests.NOT_FALSE(value);
  },
  /**
   * Checks if the value given is undefined, empty, null or false
   */
  IS_NOT_SET: (value) => {
    return !tests.IS_SET(value);
  },
  /**
   * Checks if the value given is equal to a test value
   */
  EQUALS: (value, testValue) => {
    return tests.IS_SET(value) && tests.IS_SET(testValue) && value.toString() === testValue.toString();
  },
  /**
   * Checks if the value given is not equal to a test value
   */
  NOT_EQUALS: (value, testValue) => {
    return !tests.EQUALS(value, testValue);
  },
  /**
   * Checks if the value given contains a test value
   */
  CONTAINS: (value, testValue) => {
    return tests.IS_STRING(value) && value.includes(testValue);
  },
  /**
   * Checks if the value given does not contain a test value
   */
  NOT_CONTAINS: (value, testValue) => {
    return !tests.CONTAINS(value, testValue);
  },
  /**
   * Checks if the value is greater than a test value
   */
  GREATER_THAN: (value, testValue) => {
    return tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue) && Number(value) > Number(testValue);
  },
  /**
   * Checks if the value is less than the test value
   */
  LESS_THAN: (value, testValue) => {
    return tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue) && Number(value) < Number(testValue);
  }
};
var ConditionTests_default = tests;

// src/JsonConditionChecker.ts
var JsonConditionChecker = class {
  constructor(conditions, allOrAny, json) {
    this.conditions = conditions;
    this.allOrAny = allOrAny;
    this.json = json;
    this.conditions = conditions;
    this.allOrAny = allOrAny;
    this.json = json;
  }
  /**
   * Validation config is set up in dot notation to match the form html structure
   * @param {*} obj 
   * @param {*} path 
   * @returns 
   */
  getValueFromDotNotation = (obj, path) => {
    const index = path.indexOf(".");
    if (index === -1) {
      if (typeof obj[path] == "undefined") {
        return obj;
      }
      if (typeof obj[path].value !== "undefined") {
        return obj[path].value;
      }
      return obj[path];
    }
    return this.getValueFromDotNotation(obj[path.slice(0, index)], path.slice(index + 1));
  };
  /**
   * @inheritdoc
   */
  getValue = (element) => {
    return this.getValueFromDotNotation(this.json, element);
  };
  /**
   * @inheritdoc
   */
  compare = (value, condition, conditionValue) => {
    if (typeof ConditionTests_default[condition] === "function") {
      return ConditionTests_default[condition](value, conditionValue);
    }
    return false;
  };
  /**
   * @inheritdoc
   */
  check = () => {
    if (this.allOrAny === "all") {
      return this.conditions.every((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }
    if (this.allOrAny === "any") {
      return this.conditions.some((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }
    console.warn("Invalid allOrAny value");
    return false;
  };
};
var JsonConditionChecker_default = JsonConditionChecker;

// src/FormConditionChecker.ts
var FormConditionChecker = class {
  constructor(conditions, allOrAny) {
    this.conditions = conditions;
    this.allOrAny = allOrAny;
    this.conditions = conditions;
    this.allOrAny = allOrAny;
  }
  /**
   * @inheritdoc
   */
  getValue = (inputName) => {
    let input = document.querySelector(`input[type="text"][name="${inputName}"]`);
    if (input) {
      return input.value;
    }
    let textarea = document.querySelector(`textarea[name="${inputName}"]`);
    if (textarea) {
      return textarea.value;
    }
    let select = document.querySelector(`select[name="${inputName}"]`);
    if (select) {
      return select.value;
    }
    let radio = document.querySelector(`input[type="radio"][name="${inputName}"]:checked`);
    if (radio) {
      return radio.value;
    }
    let checkbox = document.querySelector(`input[type="checkbox"][name="${inputName}"]:checked`);
    if (checkbox) {
      return checkbox.value;
    }
    return null;
  };
  /**
   * @inheritdoc
   */
  compare = (value, condition, conditionValue) => {
    if (typeof ConditionTests_default[condition] === "function") {
      return ConditionTests_default[condition](value, conditionValue);
    }
    return false;
  };
  /**
   * @inheritdoc
   */
  check = () => {
    if (this.allOrAny === "all") {
      return this.conditions.every((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }
    if (this.allOrAny === "any") {
      return this.conditions.some((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }
    console.warn("Invalid allOrAny value");
    return false;
  };
};
var FormConditionChecker_default = FormConditionChecker;
export {
  ConditionTests_default as ConditionTests,
  FormConditionChecker_default as FormConditionChecker,
  JsonConditionChecker_default as JsonConditionChecker
};
