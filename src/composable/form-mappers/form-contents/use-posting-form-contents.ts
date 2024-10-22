// Posting-form-contents.ts

import { EntityURLKey } from "@/constants";
import type {
  LocalizedSection,
  EntityFields,
  FormStructure
} from "@/interfaces/types/form-structure-types";

export function usePostingFormContents() {
  const { getEntityName } = useUtilities();

  const entityKey: EntityURLKey = "POSTING";
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
            name: "name",
            subFields: [{ name: "postingName", maxlength: 25 }]
          },
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
