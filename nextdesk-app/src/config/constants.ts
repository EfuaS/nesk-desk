/**
 * @file constants.ts
 * Application-wide configuration and Dataverse schema registry.
 *
 * STATUS_VALUES mirrors the numeric option-set codes used in FetchXML
 * filter conditions. ACTIVITY_TABLE_REGISTRY maps each UI tab to its
 * Dataverse table and column logical names.
 */

import type { ActivityTableRegistry } from '../types/dashboard';

// ────────────────────────────────────────────────────────────────
//  API Configuration
// ────────────────────────────────────────────────────────────────

export const CONFIG = {
  /** Fallback Dynamics 365 org URL (used when Xrm context is unavailable). */
  apiBase: 'https://orgab1ae89b.crm4.dynamics.com',

  /** Maximum number of activity records to fetch per tab. */
  recentLimit: 200,
} as const;

// ────────────────────────────────────────────────────────────────
//  Option-Set Numeric Values
// ────────────────────────────────────────────────────────────────

/**
 * Numeric codes for Dataverse option-set fields.
 * "general" covers Service Requests, Incidents, Changes, and Problems.
 * "ci" covers the ITSM Asset (CI) status field.
 */
export const STATUS_VALUES = {
  general: {
    Open: 497700000,
    Pending: 497700001,
    Close: 497700002,
  },
  ci: {
    Active: 124520000,
    Maintenance: 124520001,
    Retired: 124520002,
  },
} as const;

// ────────────────────────────────────────────────────────────────
//  Activity Table Registry
// ────────────────────────────────────────────────────────────────

/**
 * Maps each activity tab to its Dataverse table and column logical names.
 * The column mappings normalise each table's schema to a common UI shape:
 *   { id, activity, dateTime, status, user }
 */
export const ACTIVITY_TABLE_REGISTRY: ActivityTableRegistry = {
  'Service Request': {
    entitySetName: 'cr229_requestses',
    entityLogicalName: 'cr229_requests',
    columns: {
      id: 'cr229_requestname',
      activity: 'cr229_servicerequestcategory',
      dateTime: 'createdon',
      status: 'cr229_requeststatus',
      user: 'cr229_by',
    },
  },
  Incident: {
    entitySetName: 'cr229_incidents',
    entityLogicalName: 'cr229_incident',
    columns: {
      id: 'cr229_name',
      activity: 'cr229_incidenttype',
      dateTime: 'createdon',
      status: 'cr229_incidentstatus',
      user: 'cr229_by',
    },
  },
  CI: {
    entitySetName: 'cr229_itsm_assets',
    entityLogicalName: 'cr229_itsm_asset',
    columns: {
      id: 'cr229_newcolumn',
      activity: 'ma_assettypee',
      dateTime: 'createdon',
      status: 'ma_cistatus',
      user: 'createdby',
    },
  },
  Change: {
    entitySetName: 'cr229_changes',
    entityLogicalName: 'cr229_change',
    columns: {
      id: 'cr229_name',
      activity: 'cr229_changetype',
      dateTime: 'createdon',
      status: 'cr229_changestatus',
      user: 'cr229_by',
    },
  },
  Problem: {
    entitySetName: 'cr229_problems',
    entityLogicalName: 'cr229_problem',
    columns: {
      id: 'cr229_name',
      activity: 'cr229_problemtype',
      dateTime: 'createdon',
      status: 'cr229_problemstatus',
      user: 'cr229_by',
    },
  },
};
