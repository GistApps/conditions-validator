
/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from '@jest/globals';
import { FormConditionChecker } from "../src";

class FormValidator extends FormConditionChecker {};

describe('FORM CONDITION CHECKER', () => {

  const testFormContent =
    '<div>' +
      '<input type="text" name="attributes[datepicker]" value="2024-12-25" />' +
    '</div>';

  /**
   * @test Single input element -> Any rule type
   */
  test('1) Checks single input element (ANY rule type)', () => {

    document.body.innerHTML = testFormContent;

    const truthyDisplayRules = [
      {
        condition: "EQUALS",
        element: "attributes[datepicker]",
        value: "2024-12-25",
      },
      {
        condition: "CONTAINS",
        element: "attributes[datepicker]",
        value: "2024",
      },
      {
        condition: "NOT_CONTAINS",
        element: "attributes[datepicker]",
        value: "2025",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "EQUALS",
        element: "attributes[datepicker]",
        value: "2024",
      },
    ];

    const truthyFormChecker = new FormValidator(truthyDisplayRules, "any");
    const falsyFormChecker = new FormValidator(falsyDisplayRules, "any");
    const truthyFalsyFormChecker = new FormValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "any");

    expect(truthyFormChecker.check()).toBe(true);
    expect(falsyFormChecker.check()).toBe(false);
    expect(truthyFalsyFormChecker.check()).toBe(true);

  });

  /**
   * @test Single input element -> All rule type
   */
  test('2) Checks single input element (ALL rule type)', () => {

    document.body.innerHTML = testFormContent;

    const truthyDisplayRules = [
      {
        condition: "EQUALS",
        element: "attributes[datepicker]",
        value: "2024-12-25",
      },
      {
        condition: "CONTAINS",
        element: "attributes[datepicker]",
        value: "2024",
      },
      {
        condition: "NOT_CONTAINS",
        element: "attributes[datepicker]",
        value: "2025",
      },
    ];

    const falsyDisplayRules = [
      {
        condition: "EQUALS",
        element: "attributes[datepicker]",
        value: "2024",
      },
    ];

    const truthyFormChecker = new FormValidator(truthyDisplayRules, "all");
    const falsyFormChecker = new FormValidator(falsyDisplayRules, "all");
    const truthyFalsyFormChecker = new FormValidator([ ...truthyDisplayRules, ...falsyDisplayRules ], "all");

    expect(truthyFormChecker.check()).toBe(true);
    expect(falsyFormChecker.check()).toBe(false);
    expect(truthyFalsyFormChecker.check()).toBe(false);

  });

});
