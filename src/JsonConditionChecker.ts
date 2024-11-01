

import ConditionCheckerInterface from './ConditionCheckerInterface';
import ConditionTests from './ConditionTests';
import { AllOrAnyType, JSONConditionInterface } from './types/index';

abstract class JsonConditionChecker implements ConditionCheckerInterface {

  constructor(
    public conditions: Array<JSONConditionInterface>,
    public allOrAny: AllOrAnyType,
    public json: any
  )
  {
    this.conditions = conditions;
    this.allOrAny   = allOrAny;
    this.json       = json;
  }

  /**
   * Validation config is set up in dot notation to match the form html structure
   * @param {*} obj 
   * @param {*} path 
   * @returns 
   */
  getValueFromDotNotation = (obj: any, path: string): any => {
    
    const index = typeof(path) == 'string' ? path.indexOf('.') : -1;

    if (index === -1) {

      // For some reason path is undefined. Throw a warning.
      if (typeof(path) == "undefined") {
        console.warn("Object path is undefined", {
          obj,
          path
        });
        return obj;
      }

      // Return object if the following path is undefined
      // This likely means that the object is an array
      if (typeof(obj[path]) == "undefined" && Array.isArray(obj)) {
        return obj;
      }

      // Handle symfony form data
      if (typeof(obj[path]?.value) !== "undefined") {
        return obj[path].value;
      }

      // Handle regular form data
      return obj[path];

    }

    const newObject = obj[path.slice(0, index)];

    const newPath = path.slice(index + 1);

    // Make an array of values if the object is an array
    if (Array.isArray(newObject)) {
      return newObject.map((o) => {
        return this.getValueFromDotNotation(o, newPath);
      });
    }

    return this.getValueFromDotNotation(newObject, newPath);

  }

  /**
   * @inheritdoc
   */
  getValue = (element: string): any => {
    
    return this.getValueFromDotNotation(this.json, element);

  }

  compareEach = (value: any[], condition: string, conditionValue: any): boolean => {

    // Scenario 1: Value is an empty array.
    if (value.length === 0) {
      return ConditionTests.CONTAINS(condition, "NOT");
    }

    // Scenario 2: Value is an array of objects with a NOT condition.
    // if (ConditionTests.IS_OBJECT(value[0]) && ConditionTests.CONTAINS(condition, 'NOT')) {
    //   return !value.every((v) => {
    //     return this.compare(v, condition, conditionValue);
    //   });
    // }
    if (condition.indexOf('ALL_') === 0) {
      const baseCondition = condition.replace('ALL_', '');
      return value.every((v) => {
        return this.compare(v, baseCondition, conditionValue);
      });
    }

    // Scenario 3: Value is not an array of objects with a NOT condition.
    return value.some((v) => {
      return this.compare(v, condition, conditionValue);
    });

  }

  /**
   * @inheritdoc
   */
  compare = (value: any, condition: string, conditionValue: any): boolean => {

    if (typeof(ConditionTests[condition]) !== 'function' && typeof(ConditionTests[condition.replace("ALL_", "")]) !== "function") {
      console.warn(`Invalid condition: ${condition}`);
      return false;
    }

    if (ConditionTests.IS_ARRAY(value) && value.length > 1) {
      return this.compareEach(value, condition, conditionValue);
    }

    if (ConditionTests.IS_ARRAY(value) && value.length === 1) {
      value = value[0];
      condition = condition.replace('ALL_', '');
    }

    // For objects, compare each key and value
    if (ConditionTests.IS_OBJECT(value)) {
      const keysMatch = this.compareEach(Object.keys(value), condition, conditionValue);
      const valuesMatch = this.compareEach(Object.values(value), condition, conditionValue);
      return ConditionTests.CONTAINS(condition, "NOT") ? keysMatch && valuesMatch : keysMatch || valuesMatch;
    }

    if (condition.indexOf('ALL_') === 0) {
      condition = condition.replace('ALL_', '');
      console.warn("Condition is ALL_ but value is not an array", {
        value,
        condition,
        conditionValue,
      });
    }
    
    return ConditionTests[condition](value, conditionValue);

  }

  /**
   * @inheritdoc
   */
  check = (): boolean => {
    
    if (this.allOrAny === 'all') {
      return this.conditions.every((c) => {
        const { option, condition, value } = c;
        const elValue = this.getValue(option);
        return this.compare(elValue, condition, value);
      });
    }

    if (this.allOrAny === 'any') {
      return this.conditions.some((c) => {
        const { option, condition, value } = c;
        const elValue = this.getValue(option);
        return this.compare(elValue, condition, value);
      });
    }
    
    console.warn("Invalid allOrAny value");

    return false;
    

  }

}

export default JsonConditionChecker;