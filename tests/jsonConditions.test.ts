import { describe, expect, test } from '@jest/globals';
import { testData } from './data';
import { JsonConditionChecker } from "../src";

class JsonValidator extends JsonConditionChecker {};

describe('JSON CONDITION CHECKER', () => {

  /**
   * @test Level 1 cart data -> Any rule type
   */
  test('1) Checks level 1 JSON data (ANY rule type)', () => {

    const truthyDisplayRules = [
      {
        condition: "GREATER_THAN",
        option: "total_price",
        value: "500",
      },
      {
        condition: "NOT_EQUALS",
        option: "item_count",
        value: 3,
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "EQUALS",
        option: "currency",
        value: "USD",
      },
      {
        condition: "NOT_EQUALS",
        option: "total_discount",
        value: "0",
      },
    ];

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "any", testData.multipleItems);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testData.multipleItems);
    const truthyFalsyJsonChecker = new JsonValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "any", testData.multipleItems);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);
    expect(truthyFalsyJsonChecker.check()).toBe(true);

  });

  /**
   * @test Level 1 cart data -> All rule type
   */
  test('2) Checks level 1 JSON data (ALL rule type)', () => {

    const truthyDisplayRules = [
      {
        condition: "LESS_THAN",
        option: "total_price",
        value: 70000,
      },
      {
        condition: "NOT_EQUALS",
        option: "total_weight",
        value: 300,
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "EQUALS",
        option: "item_count",
        value: "10",
      },
      {
        condition: "GREATER_THAN",
        option: "item_count",
        value: "5",
      },
    ];

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testData.multipleItems);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "all", testData.multipleItems);
    const truthyFalsyJsonChecker = new JsonValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "all", testData.multipleItems);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);
    expect(truthyFalsyJsonChecker.check()).toBe(false);

  });

  /**
   * @test Level 2 cart data -> Multi-element array
   */
  test('3) Checks level 2 JSON data (multi-element array)', () => {

    const displayRules = [
      {
        condition: "EQUALS",
        option: "items.product_type",
        value: "Wax",
      },
      {
        condition: "NOT_EQUALS",
        option: "items.product_type",
        value: "Wax",
      },
      {
        condition: "NOT_EQUALS",
        option: "items.product_type",
        value: "Shoes",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.sku",
        value: "test-sku",
      },
      {
        condition: "CONTAINS",
        option: "items.sku",
        value: "sku",
      },
      {
        condition: "LESS_THAN",
        option: "items.final_price",
        value: 5000,
      },
    ];

    const jsonChecker = new JsonValidator(displayRules, "all", testData.multipleItems);

    expect(jsonChecker.check()).toBe(true);

  });

  /**
   * @test Level 2 cart data -> Single element array
   */
  test('4) Checks level 2 JSON data (single element array)', () => {

    const displayRules = [
      {
        condition: "EQUALS",
        option: "items.product_type",
        value: "Wax",
      },
      {
        condition: "NOT_EQUALS",
        option: "items.product_type",
        value: "Shoes",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.sku",
        value: "test-sku",
      },
      {
        condition: "LESS_THAN",
        option: "items.final_price",
        value: 5000,
      },
      {
        condition: "CONTAINS",
        option: "items.vendor",
        value: "Vendor",
      },
    ];

    const jsonChecker = new JsonValidator(displayRules, "all", testData.singleItemMultipleProps);

    expect(jsonChecker.check()).toBe(true);

  });

  /**
   * @test Level 3 cart data -> Multi-element array of Level 2 data
   */
  test('5) Checks level 3 JSON data (level 2 data is multi-element array)', () => {

    const truthyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "2030-12-25",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "message",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "2022-02-22",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "text-input",
      },
    ];
  
    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testData.multipleItems);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testData.multipleItems);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

  /**
   * @test Level 3 cart data -> Single element array of Level 2 data and Level 3 data has MULTIPLE elements
   */
  test('6) Checks level 3 JSON data (level 2 data is single element array & level 3 data has multiple elements)', () => {

    const truthyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "2030-12-25",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "message",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "text-input",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "text-input",
      },
    ];

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testData.singleItemMultipleProps);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testData.singleItemMultipleProps);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

  /**
   * @test Level 3 cart data -> Single element array of Level 2 data and Level 3 data is EMPTY object
   */
  test('7) Checks level 3 JSON data (level 2 data is single element array & level 3 data is empty)', () => {

    const truthyDisplayRules = [
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "2024-01-01",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "message",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "text-input",
      },
    ];

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testData.singleItemEmptyProps);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testData.singleItemEmptyProps);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

  /**
   * @test Level 3 cart data -> Single element array of Level 2 data and Level 3 data has SINGLE element
   */
  test('8) Checks level 3 JSON data (level 2 data is single element array & level 3 data has single element)', () => {

    const truthyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "delivery-date",
      },
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "2030-12-25",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "message",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "CONTAINS",
        option: "items.properties",
        value: "message",
      },
      {
        condition: "NOT_CONTAINS",
        option: "items.properties",
        value: "2030-12-25",
      },
    ];

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testData.singleItemSingleProps);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testData.singleItemSingleProps);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

});
