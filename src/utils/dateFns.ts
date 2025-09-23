/**
 * 
 * @copyright     (c) 2025 Gist Applications Inc.
 * @author        Greg Olive greg@gist-apps.com
 * @package       @gistapps/conditions-validator
 * 
 * /src/utils/dateFns.ts
 * Created:       Fri Sep 12 2025
 * Modified By:   Greg Olive
 * Last Modified: Mon Sep 22 2025
 */

import type {
  DateConfig,
} from '../types';

/**
 * Parses a date string into a Date object.
 */
const parseDateString = (
  dateStr: string,
): Date | null => {

  let parsedDate: Date | null = null;

  // YYYY-MM-DD → treat as local
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    parsedDate = new Date(y, m - 1, d); // local time
  }
  // January 30th, 2019
  else if (/^[A-Za-z]+\s+\d{1,2}(st|nd|rd|th),\s+\d{4}$/.test(dateStr)) {
    parsedDate = new Date(dateStr.replace(/(st|nd|rd|th)/g, ""));
  }
  // Monday, January 30th, 2019
  else if (/^[A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2}(st|nd|rd|th),\s+\d{4}$/.test(dateStr)) {
    parsedDate = new Date(dateStr.replace(/(st|nd|rd|th)/g, ""));
  }
  // 30-1-2019
  else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("-").map(Number);
    parsedDate = new Date(y, m - 1, d);
  }
  // 2019/1/30
  else if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("/").map(Number);
    parsedDate = new Date(y, m - 1, d);
  }
  // 1/30/2019 or 30/01/2019
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [a, b, c] = dateStr.split("/").map(Number);
    if (a > 12) {
      parsedDate = new Date(c, b - 1, a); // DD/MM/YYYY
    } else if (b > 12) {
      parsedDate = new Date(c, a - 1, b); // MM/DD/YYYY
    } else {
      parsedDate = new Date(c, a - 1, b); // ambiguous → MM/DD/YYYY
    }
  } else {
    // Fallback to Date constructor for other formats (ISO 8601, RFC 2822, etc.)
    parsedDate = new Date(dateStr);
  }

  if (!parsedDate || isNaN(parsedDate?.getTime())) {
    console.log(`Unrecognized date format: ${dateStr}`);
    return null;
  }

  return parsedDate;

};

/**
 * Checks if a date is currently in daylight saving time and return the offset.
 */
const getDaylightSavingOffset = (
  date: Date,
): number => {

  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);

  const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

  return (date.getTimezoneOffset() < stdTimezoneOffset) ? 1 : 0;

};

/**
 * Get the current date in the specified timezone.
 */
const getDateNow = (
  dateConfig: DateConfig,
): Date => {

  const now = new Date();

  if (dateConfig.cutoff_time_type === "customer_time") {
    return now;
  }

  const timezone = dateConfig.timezone || "0";
  const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
  const utcOffset = utcNow + (parseFloat(timezone) || 0) * 3600000;

  const date = new Date(utcOffset);

  const dstOffset = getDaylightSavingOffset(date);
  if (dstOffset) {
    date.setHours(date.getHours() + 1);
  }

  return date;

};

/**
 * Check if the current time is past the cutoff time.
 */
const pastCutoffTime = (
  dateNow: Date,
  cutoffTime: string | null,
): boolean => {

  if (!cutoffTime) {
    return false;
  }

  const [h, m, s] = cutoffTime.split(":").map(Number);
  const cutoff = new Date(dateNow);
  cutoff.setHours(h, m || 0, s || 0, 0);

  return !!(dateNow > cutoff);

};

/**
 * Add disallowed days and disabled dates to lead time.
 */
const handleAddDisallowedDaysToLeadTime = (
  dateNow: Date,
  leadTime: number,
  disabledDates: string[],
  disallowedDays: string[],
): number => {

  let updatedLead = leadTime;
  let testDate = new Date(dateNow);

  for (let i = 1; i <= updatedLead; i++) {
    testDate.setDate(dateNow.getDate() + i);

    const y = testDate.getFullYear();
    const m = String(testDate.getMonth() + 1).padStart(2, "0");
    const d = String(testDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    const dayOfWeek = testDate.getDay().toString();

    if (disabledDates.includes(dateStr) || disallowedDays.includes(dayOfWeek)) {
      updatedLead += 1;
    }
  }

  return updatedLead;

};

/**
 * Get the updated lead time considering cutoff times and disallowed/disabled dates.
 */
export const getUpdatedLeadTime = (
  dateNow: Date,
  dateConfig: DateConfig,
): number => {

  const {
    lead_time,
    cutoff_time,
    disabled_dates,
    disallowed_days,
    add_disallowed_to_lead,
  } = dateConfig;

  let updatedLead = ((typeof lead_time === "string") ? parseInt(lead_time) : lead_time) || 0;

  // 1) Apply cutoff rule
  if (pastCutoffTime(dateNow, cutoff_time)) {
    updatedLead += 1;
  }

  // 2) Apply disallowed/disabled days rule
  if (add_disallowed_to_lead) {
    updatedLead = handleAddDisallowedDaysToLeadTime(dateNow, updatedLead, disabled_dates, disallowed_days);
  }

  return updatedLead;

};

/**
 * Get the first available date from the date configuration.
 */
const getFirstAvailableDate = (
  dateNow: Date,
  dateConfig: DateConfig,
): Date => {

  const updatedLeadTime = getUpdatedLeadTime(dateNow, dateConfig);

  const target = new Date(dateNow);
  target.setDate(dateNow.getDate() + updatedLeadTime);

  return target;

};

/**
 * Get the lead time in days from a date string to the current date or the first avaliable date.
 */
export const getDaysUntilDateValue = (
  dateValue: string,
  dateConfig: DateConfig,
  calculateFrom: 'now' | 'first_available',
): number | null => {

  const dateNow = (dateConfig.now) ? parseDateString(dateConfig.now) : getDateNow(dateConfig);

  if (!dateNow) {
    return null;
  }

  const parsedDateValue = parseDateString(dateValue);
  const testDateValue = (calculateFrom === 'now') ? dateNow : getFirstAvailableDate(dateNow, dateConfig);

  if (!parsedDateValue || !testDateValue) {
    return null;
  }

  const diffTime = parsedDateValue.getTime() - testDateValue.getTime();

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));

};
