
export type FormConditionInterface = {
  element: string|HTMLElement|NodeList; // HTML input, select or textarea name attribute || or the element itself
  addElementValues?: any[];    // In case we need to see if more than one element value matches the condition value.
  condition: string;           // eg. 'CONTAINS', 'EQUALS', 'GREATER_THAN', 'LESS_THAN'
  value: any;                  // eg. undefined, null, false, 0, 1, 'string', ['array'], {object}
}

export type JSONConditionInterface = {
  option: string;    // eg "items.sku" or "items.price"
  condition: string; // eg. 'CONTAINS', 'EQUALS', 'GREATER_THAN', 'LESS_THAN', 'ALL_CONTAINS', 'ALL_EQUALS', 'ALL_GREATER_THAN', 'ALL_LESS_THAN', 'ANY_CONTAINS', 'ANY_EQUALS', 'ANY_GREATER_THAN', 'ANY_LESS_THAN'
  value: any;        // eg. undefined, null, false, 0, 1, 'string', ['array'], {object}
};

export type ConditionInterface = FormConditionInterface|JSONConditionInterface;

export type AllOrAnyType = 'all'|'any';
