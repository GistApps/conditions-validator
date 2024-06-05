
export const testData = {

  /**
   * Cart data with multiple items (level 2 data)
   */
  multipleItems: {
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
  },

  /**
   * Cart data with single item (level 2 data) and multiple item properties (level 3 data)
   */
  singleItemMultipleProps: {
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
    ],
  },

  /**
   * Cart data with single item (level 2 data) and empty item properties (level 3 data)
   */
  singleItemEmptyProps: {
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
        "properties": {
          /** LEVEL 3 DATA **/
        },
        "gift_card": false,
      },
    ],
  },

  /**
   * Cart data with single item (level 2 data) and empty item properties (level 3 data)
   */
  singleItemSingleProps: {
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
          "delivery-date": "2030-12-25",
        },
        "gift_card": false,
      },
    ],
  },

};
