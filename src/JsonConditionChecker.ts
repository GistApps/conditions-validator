

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
    
    const index = path.indexOf('.');

    if (index === -1) {

      // Return object if the following path is undefined
      // This likely means that the object is an array
      if (typeof(obj[path]) == "undefined") {
        return obj;
      }

      // Handle symfony form data
      if (typeof(obj[path].value) !== "undefined") {
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

  /**
   * @inheritdoc
   */
  compare = (value: any, condition: string, conditionValue: any): boolean => {

    if (typeof(ConditionTests[condition]) !== 'function') {
      return false;
    }

    if (ConditionTests.IS_ARRAY(value)) {
      return value.some((v) => {
        return this.compare(v, condition, conditionValue);
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