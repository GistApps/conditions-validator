import { ConditionInterface, AllOrAnyType } from "./types/index";

export default interface ConditionCheckerInterface {

  conditions: Array<ConditionInterface>;

  allOrAny: AllOrAnyType;

  /**
   * Check all conditions, and return true if all are met if allOrAny is 'all',
   * or if any are met if allOrAny is 'any'
   */
  check(): boolean;

  /**
   * Get the value from the HTML or JSON element
   * @param element 
   */
  getValue(element: string): any;

  /**
   * Compare a single condition
   * @param value 
   * @param condition 
   * @param conditionValue 
   */
  compare(value: any, condition: string, conditionValue: any): boolean;

}