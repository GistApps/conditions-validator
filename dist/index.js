// src/ConditionTests.ts
var tests = {
  NOT_UNDEFINED: (value) => {
    return typeof value !== "undefined";
  },
  NOT_NULL: (value) => {
    return value !== null;
  },
  NOT_EMPTY: (value) => {
    return tests.NOT_NULL(value) && value !== "" && (tests.IS_ARRAY(value) ? value.length > 0 : true) && (tests.IS_OBJECT(value) ? !tests.IS_EMPTY_OBJECT(value) : true);
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
  /**
   * Thanks to https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/8511350#8511350
   */
  IS_OBJECT: (value) => {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
  },
  /**
   * Thanks to https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
   */
  IS_EMPTY_OBJECT: (value) => {
    if (!tests.IS_OBJECT(value)) {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
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
    if (tests.IS_NUMBER(value) && tests.IS_NUMBER(testValue)) {
      return Number(value) === Number(testValue);
    }
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
  NOT_EQUALS: (value, testValue) => {
    return !tests.EQUALS(value, testValue);
  },
  /**
   * Checks if the value given contains a test value
   */
  CONTAINS: (value, testValue) => {
    return (tests.IS_STRING(value) || tests.IS_ARRAY(value)) && value.includes(testValue);
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
    const index = typeof path == "string" ? path.indexOf(".") : -1;
    if (index === -1) {
      if (typeof path == "undefined") {
        console.warn("Object path is undefined", {
          obj,
          path
        });
        return obj;
      }
      if (typeof obj[path] == "undefined") {
        return obj;
      }
      if (typeof obj[path].value !== "undefined") {
        return obj[path].value;
      }
      return obj[path];
    }
    const newObject = obj[path.slice(0, index)];
    const newPath = path.slice(index + 1);
    if (Array.isArray(newObject)) {
      return newObject.map((o) => {
        return this.getValueFromDotNotation(o, newPath);
      });
    }
    return this.getValueFromDotNotation(newObject, newPath);
  };
  /**
   * @inheritdoc
   */
  getValue = (element) => {
    return this.getValueFromDotNotation(this.json, element);
  };
  compareEach = (value, condition, conditionValue) => {
    if (value.length === 0) {
      return ConditionTests_default.CONTAINS(condition, "NOT");
    }
    return value.some((v) => {
      return this.compare(v, condition, conditionValue);
    });
  };
  /**
   * @inheritdoc
   */
  compare = (value, condition, conditionValue) => {
    if (typeof ConditionTests_default[condition] !== "function") {
      console.warn(`Invalid condition: ${condition}`);
      return false;
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length > 1) {
      return this.compareEach(value, condition, conditionValue);
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length === 1) {
      value = value[0];
    }
    if (ConditionTests_default.IS_OBJECT(value)) {
      const keysMatch = this.compareEach(Object.keys(value), condition, conditionValue);
      const valuesMatch = this.compareEach(Object.values(value), condition, conditionValue);
      return ConditionTests_default.CONTAINS(condition, "NOT") ? keysMatch && valuesMatch : keysMatch || valuesMatch;
    }
    return ConditionTests_default[condition](value, conditionValue);
  };
  /**
   * @inheritdoc
   */
  check = () => {
    if (this.allOrAny === "all") {
      return this.conditions.every((c) => {
        const { option, condition, value } = c;
        const elValue = this.getValue(option);
        return this.compare(elValue, condition, value);
      });
    }
    if (this.allOrAny === "any") {
      return this.conditions.some((c) => {
        const { option, condition, value } = c;
        const elValue = this.getValue(option);
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
   * Get an array of the elements values to compare. Could be one or more element values.
   * @param element 
   * @param addElementValues 
   * @returns {Array<any>}
   */
  getElementValues = (element, addElementValues) => {
    let elValues = this.getValue(element);
    if (addElementValues) {
      elValues = [...elValues, ...addElementValues];
    }
    return elValues;
  };
  /**
   * @inheritdoc
   */
  getValue = (element) => {
    var _a, _b, _c, _d;
    if (typeof element === "object") {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return [element.value];
      }
      if (element instanceof NodeList) {
        return Array.from(element).map((el) => {
          return this.getValue(el);
        });
      }
    }
    let input = document.querySelector(`input[name="${element}"]:not([type="radio"]):not([type="checkbox"])`);
    if (input) {
      return [input.value];
    }
    input = document.querySelector(`input[type="number"][name="${element}"]`);
    if (input) {
      return [input.value];
    }
    let textarea = document.querySelector(`textarea[name="${element}"]`);
    if (textarea) {
      return [textarea.value];
    }
    let select = document.querySelector(`select[name="${element}"]`);
    if (select) {
      return [
        select.value,
        select.options[select.selectedIndex].textContent
      ];
    }
    let radio = document.querySelector(`input[type="radio"][name="${element}"]:checked`);
    if (radio) {
      return [
        radio.value,
        (_b = (_a = radio.closest("label")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()
      ];
    }
    let checkbox = document.querySelectorAll(`input[type="checkbox"][name="${element}"]:checked`);
    if (checkbox.length > 0) {
      if (checkbox.length > 1) {
        let values = [];
        checkbox.forEach((cb) => {
          var _a2, _b2;
          let newValues = [
            cb.value,
            (_b2 = (_a2 = cb.closest("label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b2.trim()
          ];
          values = [
            ...values,
            ...newValues
          ];
        });
        return values;
      }
      return [
        checkbox[0].value,
        (_d = (_c = checkbox[0].closest("label")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim()
      ];
    }
    return [];
  };
  compareEach = (value, condition, conditionValue) => {
    if (ConditionTests_default.CONTAINS(condition, "NOT")) {
      return !value.every((v) => {
        return this.compare(v, condition, conditionValue);
      });
    } else {
      return value.some((v) => {
        return this.compare(v, condition, conditionValue);
      });
    }
  };
  /**
   * @inheritdoc
   */
  compare = (value, condition, conditionValue) => {
    if (typeof ConditionTests_default[condition] !== "function") {
      console.warn(`Invalid condition: ${condition}`);
      return false;
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length > 1) {
      return this.compareEach(value, condition, conditionValue);
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length === 1) {
      value = value[0];
    }
    return ConditionTests_default[condition](value, conditionValue);
  };
  /**
   * @inheritdoc
   */
  check = () => {
    if (this.allOrAny === "all") {
      return this.conditions.every((c) => {
        const { element, addElementValues, condition, value } = c;
        let elValues = this.getElementValues(element, addElementValues);
        return this.compare(elValues, condition, value);
      });
    }
    if (this.allOrAny === "any") {
      return this.conditions.some((c) => {
        const { element, addElementValues, condition, value } = c;
        let elValues = this.getElementValues(element, addElementValues);
        return this.compare(elValues, condition, value);
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
