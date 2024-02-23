# Conditions Validator

Validate a set of conditional rules.

## Usage

Import the ConditionsValidator class.

````
import ConditionsValidator from '@gistapps/conditions-validator';
````

Call the validate function and pass the validation config for testing.
The config object must contain a data object to test the rules against or a custom test function.

````
const validationConfig = {
  ruleType,
  rules,
  data: jsonData,
  test: customTestFunc,
};

ConditionsValidator.validate(validationConfig);
````

