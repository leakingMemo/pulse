/**
 * Notion API types for the Pulse Raycast extension
 */

/**
 * Notion API authentication configuration
 */
export interface NotionAuth {
  /** Notion integration token */
  token: string;
  /** API version */
  version: string;
}

/**
 * Notion database reference
 */
export interface NotionDatabase {
  /** Database ID */
  id: string;
  /** Database title */
  title: string;
  /** Database URL */
  url: string;
  /** Database properties schema */
  properties: Record<string, NotionPropertySchema>;
  /** Parent page or workspace */
  parent: NotionParent;
  /** Creation time */
  createdTime: string;
  /** Last edited time */
  lastEditedTime: string;
  /** Whether database is archived */
  archived: boolean;
}

/**
 * Notion page object
 */
export interface NotionPage {
  /** Page ID */
  id: string;
  /** Page properties */
  properties: Record<string, NotionPropertyValue>;
  /** Parent database or page */
  parent: NotionParent;
  /** Page URL */
  url: string;
  /** Creation time */
  createdTime: string;
  /** Last edited time */
  lastEditedTime: string;
  /** Created by user */
  createdBy: NotionUser;
  /** Last edited by user */
  lastEditedBy: NotionUser;
  /** Whether page is archived */
  archived: boolean;
  /** Page icon */
  icon?: NotionIcon;
  /** Page cover image */
  cover?: NotionFile;
}

/**
 * Notion parent reference
 */
export interface NotionParent {
  /** Parent type */
  type: 'database_id' | 'page_id' | 'workspace';
  /** Database ID (if parent is database) */
  database_id?: string;
  /** Page ID (if parent is page) */
  page_id?: string;
  /** Workspace flag (if parent is workspace) */
  workspace?: boolean;
}

/**
 * Notion user object
 */
export interface NotionUser {
  /** User ID */
  id: string;
  /** User type */
  type: 'person' | 'bot';
  /** User name */
  name?: string;
  /** Avatar URL */
  avatar_url?: string;
  /** Email (if available) */
  email?: string;
}

/**
 * Notion property schema definition
 */
export interface NotionPropertySchema {
  /** Property ID */
  id: string;
  /** Property name */
  name: string;
  /** Property type */
  type: NotionPropertyType;
  /** Type-specific configuration */
  [key: string]: unknown;
}

/**
 * Notion property types
 */
export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

/**
 * Notion property value
 */
export interface NotionPropertyValue {
  /** Property ID */
  id: string;
  /** Property type */
  type: NotionPropertyType;
  /** Type-specific value */
  [key: string]: unknown;
}

/**
 * Notion rich text object
 */
export interface NotionRichText {
  /** Text type */
  type: 'text' | 'mention' | 'equation';
  /** Plain text content */
  plain_text: string;
  /** Annotations */
  annotations: NotionAnnotations;
  /** Link URL */
  href?: string;
  /** Text-specific data */
  text?: {
    content: string;
    link?: { url: string };
  };
}

/**
 * Text annotations
 */
export interface NotionAnnotations {
  /** Bold text */
  bold: boolean;
  /** Italic text */
  italic: boolean;
  /** Strikethrough text */
  strikethrough: boolean;
  /** Underlined text */
  underline: boolean;
  /** Code formatting */
  code: boolean;
  /** Text color */
  color: NotionColor;
}

/**
 * Notion color options
 */
export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

/**
 * Notion icon object
 */
export interface NotionIcon {
  /** Icon type */
  type: 'emoji' | 'external' | 'file';
  /** Emoji (if type is emoji) */
  emoji?: string;
  /** External URL (if type is external) */
  external?: { url: string };
  /** File reference (if type is file) */
  file?: NotionFile;
}

/**
 * Notion file object
 */
export interface NotionFile {
  /** File URL */
  url: string;
  /** Expiry time */
  expiry_time?: string;
}

/**
 * Notion block object
 */
export interface NotionBlock {
  /** Block ID */
  id: string;
  /** Parent block or page */
  parent: {
    type: 'page_id' | 'block_id';
    page_id?: string;
    block_id?: string;
  };
  /** Block type */
  type: NotionBlockType;
  /** Whether block has children */
  has_children: boolean;
  /** Whether block is archived */
  archived: boolean;
  /** Creation time */
  created_time: string;
  /** Last edited time */
  last_edited_time: string;
  /** Created by user */
  created_by: NotionUser;
  /** Last edited by user */
  last_edited_by: NotionUser;
  /** Type-specific block data */
  [key: string]: unknown;
}

/**
 * Notion block types
 */
export type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'child_page'
  | 'child_database'
  | 'embed'
  | 'image'
  | 'video'
  | 'file'
  | 'pdf'
  | 'bookmark'
  | 'callout'
  | 'quote'
  | 'equation'
  | 'divider'
  | 'table_of_contents'
  | 'column'
  | 'column_list'
  | 'link_preview'
  | 'synced_block'
  | 'template'
  | 'link_to_page'
  | 'table'
  | 'table_row';

/**
 * Notion API query parameters
 */
export interface NotionQuery {
  /** Database or page ID */
  database_id?: string;
  /** Filter conditions */
  filter?: NotionFilter;
  /** Sort configuration */
  sorts?: NotionSort[];
  /** Start cursor for pagination */
  start_cursor?: string;
  /** Page size */
  page_size?: number;
}

/**
 * Notion filter object
 */
export interface NotionFilter {
  /** Property name */
  property?: string;
  /** Filter operator */
  [key: string]: unknown;
}

/**
 * Notion sort configuration
 */
export interface NotionSort {
  /** Property to sort by */
  property?: string;
  /** Timestamp to sort by */
  timestamp?: 'created_time' | 'last_edited_time';
  /** Sort direction */
  direction: 'ascending' | 'descending';
}

/**
 * Notion API response wrapper
 */
export interface NotionResponse<T> {
  /** Response object */
  object: 'list';
  /** Result items */
  results: T[];
  /** Next cursor for pagination */
  next_cursor: string | null;
  /** Whether there are more results */
  has_more: boolean;
  /** Response type */
  type?: string;
  /** Page or database specific data */
  page_or_database?: Record<string, unknown>;
}

/**
 * Notion API error response
 */
export interface NotionError {
  /** Error status */
  status: number;
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Request ID for debugging */
  request_id?: string;
}

/**
 * Notion workspace information
 */
export interface NotionWorkspace {
  /** Workspace ID */
  id: string;
  /** Workspace name */
  name: string;
  /** Workspace domain */
  domain?: string;
  /** Workspace icon */
  icon?: NotionIcon;
}

/**
 * Notion API client configuration
 */
export interface NotionClientConfig {
  /** Integration token */
  auth: string;
  /** API base URL */
  baseURL?: string;
  /** Notion API version */
  notionVersion?: string;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
  /** Retry configuration */
  retry?: {
    maxRetries: number;
    minTimeout: number;
    maxTimeout: number;
  };
}

/**
 * Notion search parameters
 */
export interface NotionSearchParams {
  /** Search query */
  query: string;
  /** Filter by object type */
  filter?: {
    value: 'page' | 'database';
    property: 'object';
  };
  /** Sort configuration */
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'last_edited_time';
  };
  /** Start cursor for pagination */
  start_cursor?: string;
  /** Page size */
  page_size?: number;
}
