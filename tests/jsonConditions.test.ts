import { describe, expect, test } from '@jest/globals';
import { JsonConditionChecker } from "../src";

class JsonValidator extends JsonConditionChecker {};

describe('JSON CONDITION CHECKER', () => {

  const testCartData = {
    /** LEVEL 1 DATA **/
    "total_price": 65490,
    "total_discount": 0,
    "item_count": 2,
    "total_weight": 56.699,
    "currency": "CAD",
    "requires_shipping": true,
    "items": [
      {
        /** LEVEL 2 DATA **/
        "final_price": 2495,
        "total_discount": 0,
        "grams": 57,
        "vendor": "Test Vendor",
        "product_title": "Selling Plans Ski Wax",
        "product_type": "Wax",
        "product_description": null,
        "quantity": 1,
        "sku": "",
        "product_id": 7650619785397,
        "variant_id": 43605568389301,
        "variant_title": "Selling Plans Ski Wax",
        "properties": {
          /** LEVEL 3 DATA **/
          "message": "2030-12-25",
          "delivery-date": "2030-12-25",
        },
        "gift_card": false,
      },
      {
        
        "final_price": 62995,
        "total_discount": 0,
        "grams": 0,
        "vendor": "Multi-managed Vendor",
        "product_title": "The Multi-managed Snowboard",
        "product_type": "",
        "product_description": null,
        "quantity": 1,
        "sku": "sku-managed-1",
        "product_id": 7650619621557,
        "variant_id": 43605567963317,
        "variant_title": null,
        "properties": {},
        "gift_card": false,
      },
    ],
  };

  // Modified cart data with single item (Level 2 data)
  const testDataSingleItem = { ...testCartData, items: [testCartData.items[0]] };

  // Modified cart data with single item (Level 2 data) and empty properties object (Level 3 data)
  const testDataEmptyProps = { ...testCartData, items: [testCartData.items[1]] };

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

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "any", testCartData);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testCartData);
    const truthyFalsyJsonChecker = new JsonValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "any", testCartData);

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

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testCartData);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "all", testCartData);
    const truthyFalsyJsonChecker = new JsonValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "all", testCartData);

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

    const jsonChecker = new JsonValidator(displayRules, "all", testCartData);

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

    const jsonChecker = new JsonValidator(displayRules, "all", testDataSingleItem);

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
  
    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testDataSingleItem);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testDataSingleItem);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

  /**
   * @test Level 3 cart data -> Single element array of Level 2 data and Level 3 data has elements
   */
  test('6) Checks level 3 JSON data (level 2 data is single element array & level 3 data has elements)', () => {

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

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testDataSingleItem);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testDataSingleItem);

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

    const truthyJsonChecker = new JsonValidator(truthyDisplayRules, "all", testDataEmptyProps);
    const falsyJsonChecker = new JsonValidator(falsyDisplayRules, "any", testDataEmptyProps);

    expect(truthyJsonChecker.check()).toBe(true);
    expect(falsyJsonChecker.check()).toBe(false);

  });

});
