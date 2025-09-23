// src/utils/dateFns.ts
var parseDateString = (dateStr) => {
  let parsedDate = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    parsedDate = new Date(y, m - 1, d);
  } else if (/^[A-Za-z]+\s+\d{1,2}(st|nd|rd|th),\s+\d{4}$/.test(dateStr)) {
    parsedDate = new Date(dateStr.replace(/(st|nd|rd|th)/g, ""));
  } else if (/^[A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2}(st|nd|rd|th),\s+\d{4}$/.test(dateStr)) {
    parsedDate = new Date(dateStr.replace(/(st|nd|rd|th)/g, ""));
  } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("-").map(Number);
    parsedDate = new Date(y, m - 1, d);
  } else if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("/").map(Number);
    parsedDate = new Date(y, m - 1, d);
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [a, b, c] = dateStr.split("/").map(Number);
    if (a > 12) {
      parsedDate = new Date(c, b - 1, a);
    } else if (b > 12) {
      parsedDate = new Date(c, a - 1, b);
    } else {
      parsedDate = new Date(c, a - 1, b);
    }
  } else {
    parsedDate = new Date(dateStr);
  }
  if (!parsedDate || isNaN(parsedDate == null ? void 0 : parsedDate.getTime())) {
    console.log(`Unrecognized date format: ${dateStr}`);
    return null;
  }
  return parsedDate;
};
var getDaylightSavingOffset = (date) => {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return date.getTimezoneOffset() < stdTimezoneOffset ? 1 : 0;
};
var getDateNow = (dateConfig) => {
  const now = /* @__PURE__ */ new Date();
  if (dateConfig.cutoff_time_type === "customer_time") {
    return now;
  }
  const timezone = dateConfig.timezone || "0";
  const utcNow = now.getTime() + now.getTimezoneOffset() * 6e4;
  const utcOffset = utcNow + (parseFloat(timezone) || 0) * 36e5;
  const date = new Date(utcOffset);
  const dstOffset = getDaylightSavingOffset(date);
  if (dstOffset) {
    date.setHours(date.getHours() + 1);
  }
  return date;
};
var pastCutoffTime = (dateNow, cutoffTime) => {
  if (!cutoffTime) {
    return false;
  }
  const [h, m, s] = cutoffTime.split(":").map(Number);
  const cutoff = new Date(dateNow);
  cutoff.setHours(h, m || 0, s || 0, 0);
  return !!(dateNow > cutoff);
};
var handleAddDisallowedDaysToLeadTime = (dateNow, leadTime, disabledDates, disallowedDays) => {
  let updatedLead = leadTime;
  let testDate = new Date(dateNow);
  for (let i = 1; i <= updatedLead; i++) {
    testDate.setDate(dateNow.getDate() + i);
    const y = testDate.getFullYear();
    const m = String(testDate.getMonth() + 1).padStart(2, "0");
    const d = String(testDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = testDate.getDay().toString();
    if (disabledDates.includes(dateStr) || disallowedDays.includes(dayOfWeek)) {
      updatedLead += 1;
    }
  }
  return updatedLead;
};
var getUpdatedLeadTime = (dateNow, dateConfig) => {
  const {
    lead_time,
    cutoff_time,
    disabled_dates,
    disallowed_days,
    add_disallowed_to_lead
  } = dateConfig;
  let updatedLead = (typeof lead_time === "string" ? parseInt(lead_time) : lead_time) || 0;
  if (pastCutoffTime(dateNow, cutoff_time)) {
    updatedLead += 1;
  }
  if (add_disallowed_to_lead) {
    updatedLead = handleAddDisallowedDaysToLeadTime(dateNow, updatedLead, disabled_dates, disallowed_days);
  }
  return updatedLead;
};
var getFirstAvailableDate = (dateNow, dateConfig) => {
  const updatedLeadTime = getUpdatedLeadTime(dateNow, dateConfig);
  const target = new Date(dateNow);
  target.setDate(dateNow.getDate() + updatedLeadTime);
  return target;
};
var getDaysUntilDateValue = (dateValue, dateConfig, calculateFrom) => {
  const dateNow = dateConfig.now ? parseDateString(dateConfig.now) : getDateNow(dateConfig);
  if (!dateNow) {
    return null;
  }
  const parsedDateValue = parseDateString(dateValue);
  const testDateValue = calculateFrom === "now" ? dateNow : getFirstAvailableDate(dateNow, dateConfig);
  if (!parsedDateValue || !testDateValue) {
    return null;
  }
  const diffTime = parsedDateValue.getTime() - testDateValue.getTime();
  return Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
};

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
  },
  /**
   * Converts the date value to a lead time in days to NOW,
   * then checks if the lead time is greater than the test value.
   */
  GREATER_THAN_DATE_NOW: (value, testValue, config) => {
    if (!tests.IS_STRING(value) || !tests.IS_NUMBER(testValue) || !(config == null ? void 0 : config.date)) {
      return false;
    }
    const leadTime = getDaysUntilDateValue(value, config.date, "now");
    return tests.GREATER_THAN(leadTime, testValue);
  },
  /**
   * Converts the date value to a lead time in days to NOW,
   * then checks if the lead time is less than the test value.
   */
  LESS_THAN_DATE_NOW: (value, testValue, config) => {
    if (!tests.IS_STRING(value) || !tests.IS_NUMBER(testValue) || !(config == null ? void 0 : config.date)) {
      return false;
    }
    const leadTime = getDaysUntilDateValue(value, config.date, "now");
    return tests.LESS_THAN(leadTime, testValue);
  },
  /**
   * Converts the date value to a lead time in days to the FIRST AVAILABLE date,
   * then checks if the lead time is greater than the test value.
   */
  GREATER_THAN_DATE_FIRST: (value, testValue, config) => {
    if (!tests.IS_STRING(value) || !tests.IS_NUMBER(testValue) || !(config == null ? void 0 : config.date)) {
      return false;
    }
    const leadTime = getDaysUntilDateValue(value, config.date, "first_available");
    return tests.GREATER_THAN(leadTime, testValue);
  },
  /**
   * Converts the date value to a lead time in days to the FIRST AVAILABLE date,
   * then checks if the lead time is less than the test value.
   */
  LESS_THAN_DATE_FIRST: (value, testValue, config) => {
    if (!tests.IS_STRING(value) || !tests.IS_NUMBER(testValue) || !(config == null ? void 0 : config.date)) {
      return false;
    }
    const leadTime = getDaysUntilDateValue(value, config.date, "first_available");
    return tests.LESS_THAN(leadTime, testValue);
  }
};
var ConditionTests_default = tests;

// src/JsonConditionChecker.ts
var JsonConditionChecker = class {
  constructor(conditions, allOrAny, json, config) {
    this.conditions = conditions;
    this.allOrAny = allOrAny;
    this.json = json;
    this.config = config;
    this.conditions = conditions;
    this.allOrAny = allOrAny;
    this.json = json;
    this.config = config || {};
  }
  /**
   * Validation config is set up in dot notation to match the form html structure
   * @param {*} obj 
   * @param {*} path 
   * @returns 
   */
  getValueFromDotNotation = (obj, path) => {
    var _a;
    const index = typeof path == "string" ? path.indexOf(".") : -1;
    if (index === -1) {
      if (typeof path == "undefined") {
        console.warn("Object path is undefined", {
          obj,
          path
        });
        return obj;
      }
      if (typeof obj[path] == "undefined" && Array.isArray(obj)) {
        return obj;
      }
      if (typeof ((_a = obj[path]) == null ? void 0 : _a.value) !== "undefined") {
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
    if (condition.indexOf("ALL_") === 0) {
      const baseCondition = condition.replace("ALL_", "");
      return value.every((v) => {
        return this.compare(v, baseCondition, conditionValue);
      });
    }
    return value.some((v) => {
      return this.compare(v, condition, conditionValue);
    });
  };
  /**
   * @inheritdoc
   */
  compare = (value, condition, conditionValue) => {
    if (typeof ConditionTests_default[condition] !== "function" && typeof ConditionTests_default[condition.replace("ALL_", "")] !== "function") {
      console.warn(`Invalid condition: ${condition}`);
      return false;
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length > 1) {
      return this.compareEach(value, condition, conditionValue);
    }
    if (ConditionTests_default.IS_ARRAY(value) && value.length === 1) {
      value = value[0];
      condition = condition.replace("ALL_", "");
    }
    if (ConditionTests_default.IS_OBJECT(value)) {
      const keysMatch = this.compareEach(Object.keys(value), condition, conditionValue);
      const valuesMatch = this.compareEach(Object.values(value), condition, conditionValue);
      return ConditionTests_default.CONTAINS(condition, "NOT") ? keysMatch && valuesMatch : keysMatch || valuesMatch;
    }
    if (condition.indexOf("ALL_") === 0) {
      condition = condition.replace("ALL_", "");
      console.warn("Condition is ALL_ but value is not an array", {
        value,
        condition,
        conditionValue
      });
    }
    return ConditionTests_default[condition](value, conditionValue, this.config);
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
    if (typeof ConditionTests_default[condition] !== "function" && typeof ConditionTests_default[condition.replace("ALL_", "")] !== "function") {
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
