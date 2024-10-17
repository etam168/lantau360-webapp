// @/interfaces/types/form-structure-types.ts

export type LocaleMode = "en" | "cn" | "hk";

export interface SubField {
  name: string;
  label?: string;
  maxlength?: number;
  type?: string;
  icon?: string;
  side?: boolean;
  locale?: "En" | "Cn" | "Hk";
  altField?: string;
  value?: string | number | Record<string, any>;
}

export interface Field {
  name: string;
  subFields: SubField[];
  divider?: boolean;
}

export interface Language {
  code: string;
  name: string;
  fields: SubField[];
}

export interface LocalizedSection {
  languages: Language[];
}

export interface EntitySection {
  name: string;
  fields: Field[];
}

export interface EntityFields {
  sections: EntitySection[];
}

export interface FormStructure {
  localizedSection?: LocalizedSection;
  entityFields?: EntityFields;
}

export interface GridCellStructure {
  sections: EntitySection[];
}
