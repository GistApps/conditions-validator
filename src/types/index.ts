
export type Rule = {
  condition: string;
  option: string;
  value: any;
};

export type ValidatorConfig = {
  rules: Rule[];
  ruleType: string;
  data?: any;
  test?: Function;
};
