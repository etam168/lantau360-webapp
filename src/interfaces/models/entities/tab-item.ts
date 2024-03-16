export interface TabItem {
  name: string;
  label: string;
  [key: string]: any; // This allows any number of additional fields with any value type
}
