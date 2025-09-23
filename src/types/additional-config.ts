/**
 * 
 * @copyright     (c) 2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 * 
 * /src/types/additional-config.ts
 * Created:       Fri Sep 12 2025
 * Modified By:   Greg Olive
 * Last Modified: Mon Sep 22 2025
 */

export type AdditionalConfigInterface = {
  date?: DateConfig;
};

export type DateConfig = {
  now?: string;                     // e.g. "2023-10-31T13:00:00"
  timezone: string | null;          // e.g. "-5.0"
  lead_time: number | string;       // e.g. 2
  cutoff_time: string | null;       // e.g. "16:00:00"
  cutoff_time_type: string;         // e.g. "shop_time" | "customer_time"
  disabled_dates: string[];         // e.g. ["2023-12-25", "2024-01-01"]
  disallowed_days: string[];        // e.g. ["0", "1"]
  add_disallowed_to_lead: boolean;
};
