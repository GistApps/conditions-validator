# Conditions Validator

Validate a set of conditional rules.

## Usage

Import the ConditionsValidator class and types if desired.

````
import {FormConditionChecker, JsonConditionChecker} from '@gistapps/conditions-validator';
import {JSONConditionInterface, FormConditionInterface} from '@gistapps/conditions-validator/tests';
````

Call the validate function and pass the validation config for testing.
The config object must contain a data object to test the rules against or a custom test function.

For validating the state of an HTML form, use the FormConditionChecker class, and pass an array of conditions that implement FormConditionInterface. The element should be the field name of an html form input

````

// <input type="checkbox" name="attributes[gift]" value="yes" checked="checked" />

const formConditions: FormConditionInterface[] = [
  {
    element: 'attributes[gift]',  // HTML input, select or textarea name
    condition: 'IS_SET',          // References conditions tests
    value: undefined              // Test value. We'll find the input value
  },
  {
    element: 'attributes[gift]', // HTML query selector
    condition: 'EQUAL_TO',
    value: 'yes'
  }
];

const formChecker = new FormConditionChecker(formConditions, 'all');

const formValid   = formChecker.check();

console.log("Form valid", formValid); // true

````

For validating JSON data, use the JsonConditionChecker, and pass the json object as a third parameter. The conditions array should implement JSONConditionInterface.

````
const jsonData = {
  items: [
    {
      title: "Product 1",
      product_id: 1000001,
      sku: "variant-sku-1"
    },
    {
      title: "Product 2",
      product_id: 1000002,
      sku: "variant-sku-2"
    }
  ]
};

const jsonConditions = [
  {
    option: 'items.sku',
    condition: 'CONTAINS',
    value: 'variant-sku-3'
  },
  {
    option: 'items.sku',
    condition: 'CONTAINS',
    value: 'variant-sku-3'
  }
];

const jsonChecker = new JsonConditionChecker(jsonConditions, 'any', jsonData);

const jsonValid   =  jsonChecker.check();

console.log("JSON valid", jsonValid); // false

````

