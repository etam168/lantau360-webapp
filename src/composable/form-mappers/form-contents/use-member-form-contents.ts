// member-form-contents.ts

import { EntityURLKey } from "@/constants";
import type {
  LocalizedSection,
  EntityFields,
  FormStructure
} from "@/interfaces/types/form-structure-types";

export function useMemberFormContents() {
  const { getEntityName } = useUtilities();

  const entityKey: EntityURLKey = "MEMBER";
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
          { name: "galleryImages", subFields: [{ name: "galleryImages", type: "avatar" }] },
          {
            name: "alias",
            subFields: [{ name: "alias", maxlength: 25 }]
          },
          {
            name: "name",
            subFields: [
              { name: "firstName", maxlength: 50 },
              { name: "lastName", maxlength: 50 }
            ]
          },
          {
            name: "phone",
            subFields: [{ name: "phone", icon: "phone", type: "tel", maxlength: 16 }]
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
