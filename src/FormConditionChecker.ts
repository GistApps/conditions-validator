

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
   * Get an array of the elements values to compare. Could be one or more element values.
   * @param element 
   * @param addElementValues 
   * @returns {Array<any>}
   */
  getElementValues = (element: string|HTMLElement|NodeList, addElementValues?: any[]): any[] => {

    let elValues = this.getValue(element);

    if (addElementValues) {
      elValues = [...elValues, ...addElementValues];
    }

    return elValues;

  };

  /**
   * @inheritdoc
   */
  getValue = (element: string|HTMLElement|Node|NodeList): any => {
    
    // Handle pre-defined HTML Elements
    if (typeof(element) === 'object') {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return [element.value];
      }
      if (element instanceof NodeList) {
        return Array.from(element).map((el) => {
          return this.getValue(el);
        });
      }
    }

    let input = document.querySelector(`input[name="${element}"]:not([type="radio"]):not([type="checkbox"])`) as HTMLInputElement;

    if (input) {
      return [input.value];
    }

    input = document.querySelector(`input[type="number"][name="${element}"]`) as HTMLInputElement;

    if (input) {
      return [input.value];
    }

    let textarea = document.querySelector(`textarea[name="${element}"]`) as HTMLTextAreaElement;

    if (textarea) {
      return [textarea.value];
    }

    let select = document.querySelector(`select[name="${element}"]`) as HTMLSelectElement;

    if (select) {
      return [
        select.value,
        select.options[select.selectedIndex].textContent
      ];
    }

    let radio = document.querySelector(`input[type="radio"][name="${element}"]:checked`) as HTMLInputElement;

    if (radio) {
      return [
        radio.value,
        radio.closest('label')?.textContent?.trim()
      ];
    }

    let checkbox = document.querySelectorAll(`input[type="checkbox"][name="${element}"]:checked`) as NodeListOf<HTMLInputElement>;

    if (checkbox.length > 0) {

      if (checkbox.length > 1) {
        
        let values: any = [];
        
        checkbox.forEach((cb) => {

          let newValues = [
            cb.value,
            cb.closest('label')?.textContent?.trim()
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
        checkbox[0].closest('label')?.textContent?.trim()
      ];
    }

    return [];

  }

  compareEach = (value: any[], condition: string, conditionValue: any): boolean => {

    // If the condition is NOT, we need to check to see if "Not every value" matches the condition
    if (ConditionTests.CONTAINS(condition, 'NOT')) {
      return !value.every((v) => {
        return this.compare(v, condition, conditionValue);
      });
    } else {
      return value.some((v) => {
        return this.compare(v, condition, conditionValue);
      });
    }

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
    }

    return ConditionTests[condition](value, conditionValue);

  }

  /**
   * @inheritdoc
   */
  check = (): boolean => {
    
    if (this.allOrAny === 'all') {
      return this.conditions.every((c) => {
        
        const { element, addElementValues, condition, value } = c;
        
        let elValues = this.getElementValues(element, addElementValues);

        return this.compare(elValues, condition, value);
      });
    }

    if (this.allOrAny === 'any') {
      return this.conditions.some((c) => {
        
        const { element, addElementValues, condition, value } = c;
        
        let elValues = this.getElementValues(element, addElementValues);

        return this.compare(elValues, condition, value);

      });
    }
    
    console.warn("Invalid allOrAny value");

    return false;
    

  }

}

export default FormConditionChecker;