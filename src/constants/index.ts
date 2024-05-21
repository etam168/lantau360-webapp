export const NONE = "none";
export const AREA_NAME = "areaName";

export const STRIPE_PUBLISH_KEY = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
export const FREE_TOP_UP_POINTS_REQUEST_LIMIT = 1;

export { default as DIRECTORY_GROUPS } from "./app/directory-groups";
export { default as RENDERER } from "./app/renderer";
export { default as STORAGE_KEYS } from "./app/storage-keys";
export { default as TEMPLATE } from "./app/template";

export * from "./app/server-urls";
export * from "./app/more-page";
export * from "./app/image-icon";
