
export type FormConditionInterface = {
  element: string;   // HTML input, select or textarea name
  condition: string; // eg. 'CONTAINS', 'EQUALS', 'GREATER_THAN', 'LESS_THAN'
  value: any;        // eg. undefined, null, false, 0, 1, 'string', ['array'], {object}
}

export type JSONConditionInterface = {
  option: string;    // eg "items.sku" or "items.price"
  condition: string; // eg. 'CONTAINS', 'EQUALS', 'GREATER_THAN', 'LESS_THAN'
  value: any;        // eg. undefined, null, false, 0, 1, 'string', ['array'], {object}
};

export type ConditionInterface = FormConditionInterface|JSONConditionInterface;

export type AllOrAnyType = 'all'|'any';
