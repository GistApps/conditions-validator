

import ConditionTests from './ConditionTests';
import { FormConditionInterface, AllOrAnyType } from './types/index';
import ConditionCheckerInterface from './ConditionCheckerInterface';

abstract class FormConditionChecker implements ConditionCheckerInterface {

  constructor(
    public conditions: Array<FormConditionInterface>,
    public allOrAny: AllOrAnyType
  )
  {
    this.conditions = conditions;
    this.allOrAny = allOrAny;

  }

  /**
   * @inheritdoc
   */
  getValue = (inputName: string): any => {
    
    let input = document.querySelector(`input[type="text"][name="${inputName}"]`) as HTMLInputElement;

    if (input) {
      return input.value;
    }

    let textarea = document.querySelector(`textarea[name="${inputName}"]`) as HTMLTextAreaElement;

    if (textarea) {
      return textarea.value;
    }

    let select = document.querySelector(`select[name="${inputName}"]`) as HTMLSelectElement;

    if (select) {
      return select.value;
    }

    let radio = document.querySelector(`input[type="radio"][name="${inputName}"]:checked`) as HTMLInputElement;

    if (radio) {
      return radio.value;
    }

    let checkbox = document.querySelector(`input[type="checkbox"][name="${inputName}"]:checked`) as HTMLInputElement;

    if (checkbox) {
      return checkbox.value;
    }

    return null;

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

export default FormConditionChecker;