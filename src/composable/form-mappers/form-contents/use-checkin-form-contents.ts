// Posting-form-contents.ts

import { EntityURLKey } from "@/constants";
import type {
  LocalizedSection,
  EntityFields,
  FormStructure
} from "@/interfaces/types/form-structure-types";

export function useCheckinFormContents() {
  const { getEntityName } = useUtilities();

  const entityKey: EntityURLKey = "CHECKIN";
  const entity = getEntityName(entityKey);

  const createLabel = (name: string) => `${entity}.columns.${name}`;

  const localizedSection: LocalizedSection = {
    languages: []
  };

  const entityFields: EntityFields = {
    sections: [
      {
        name: "additional",
        fields: [
          // { name: "galleryImages", subFields: [{ name: "galleryImages", type: "avatar" }] },
          {
            name: "checkInfo",
            subFields: [{ name: "checkInfo", type: "textarea" }]
          }
        ]
      }
    ].map(section => ({
      ...section,
      fields: section.fields.map(field => ({
        ...field,
        subFields: field.subFields.map(subField => ({
          ...subField,
          label: createLabel(subField.name)
        }))
      }))
    }))
  };

  const formStructure: FormStructure = {
    localizedSection,
    entityFields
  };

  return {
    formStructure
  };
}
