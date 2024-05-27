

import ConditionCheckerInterface from './ConditionCheckerInterface';
import ConditionTests from './ConditionTests';
import { AllOrAnyType, FormConditionInterface } from './types/index';

abstract class JsonConditionChecker implements ConditionCheckerInterface {

  constructor(
    public conditions: Array<FormConditionInterface>,
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
      return obj[path]
    }

    return this.getValueFromDotNotation(obj[path.slice(0, index)], path.slice(index + 1));

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

    if (typeof(ConditionTests[condition]) === 'function') {
      return ConditionTests[condition](value, conditionValue);
    }

    return false;

  }

  /**
   * @inheritdoc
   */
  check = (): boolean => {
    
    if (this.allOrAny === 'all') {
      return this.conditions.every((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }

    if (this.allOrAny === 'any') {
      return this.conditions.some((c) => {
        const { element, condition, value } = c;
        const elValue = this.getValue(element);
        return this.compare(elValue, condition, value);
      });
    }
    
    console.warn("Invalid allOrAny value");

    return false;
    

  }

}

export default JsonConditionChecker;