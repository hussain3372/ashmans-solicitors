import { FromOtherItemsI, ItemsDataI } from "../../components/FormItems/FormItems";
import { FormFieldDataI } from "../../shared/types/forms";

export const getFormItemsData = (
  formId: string,
  fields: FormFieldDataI[]
): Record<number, ItemsDataI[]> => {
  const removeSlug = (slug: string) =>
    fields.filter((field) => field.slug !== slug).map(({ slug }) => ({ slug })) ?? [];

  switch (formId) {
    // Police Station Attendance Report
    case "4":
      return {
        // Police Station Attendance Report
        1: removeSlug("fee-earner"),
        // DSCC Call
        2: removeSlug("separator"),
        // Other Party Details
        3: fields.map(({ slug }) => ({ slug })) ?? [],
        // Police Disclosure Prior To Interview With Client
        4:
          fields.map(({ id, slug }) => {
            let className = "form-item";
            if (id >= 131 && id <= 139 && id !== 138) {
              className = "form-item-2";
            }
            if ([1621, 141, 143, 145, 147, 149, 151, 153].includes(id)) {
              className = "form-item-3";
            }
            const fromOtherItems = [] as FromOtherItemsI[];
            if (id >= 133 && id <= 139) {
              fromOtherItems.push({ type: "disabled", slug: "voluntary-attendance", value: "yes" });
            }
            if (id >= 134 && id <= 136) {
              fromOtherItems.push({ type: "disabled", slug: "under-arrest", value: "na" });
            }
            return {
              slug,
              className,
              hasWrapper: slug === "custody-record-number",
              fromOtherItems,
            };
          }) ?? [],
        // Disclosure
        5:
          fields.map(({ id, slug }) => {
            let className = "form-item";
            if ([508, 154, 155].includes(id)) {
              className = "";
            }
            if ([158, 159, 161, 163, 165, 167, 169, 171, 173, 175].includes(id)) {
              className = "form-item-3";
            }
            return { slug, className, isTextArea: slug === "disclosure" };
          }) ?? [],
        // Initial Conflict Check
        6:
          fields.map(({ id, slug }) => {
            let className = "form-item";
            if (id >= 176 && id <= 181) {
              className = "form-item-2";
            }
            if (id === 182) {
              className = "form-btn-wrapper d-flex-center";
            }
            return {
              slug,
              className,
              hasWrapper: slug === "signature-fe",
              isTextArea: id >= 176 && id <= 179,
            };
          }) ?? [],
        // Instructions From Client Prior To Interview
        7:
          fields
            .filter((field) => field.slug !== "clients-signature")
            .map(({ id, slug }) => {
              let className = "form-item";
              if ([184, 186, 190, 192, 194, 196, 198, 200].includes(id)) {
                className = "form-item-3";
              }
              if (id === 462) {
                className = "";
              }
              if (id === 204) {
                className = "form-btn-wrapper d-flex-center";
              }
              return {
                slug,
                className,
                hasWrapper: slug === "clients-signature-confirm-agreement-above",
                isTextArea: slug === "instructions",
              };
            }) ?? [],
        // Advice Based On Above Instructions
        45:
          fields.map(({ id, slug }) => {
            let className = "form-item";
            if ([464, 205, 206, 208].includes(id)) {
              className = "";
            }
            if (id === 207) {
              className = "form-item-2";
            }
            if (id === 209) {
              className = "form-item-3 form-btn-wrapper d-flex-center";
            }
            if (id === 758) {
              className = "form-btn-wrapper d-flex-center";
            }
            return {
              slug,
              className,
              hasWrapper: [207, 758].includes(id),
              isTextArea: [205, 206, 208].includes(id),
              fromOtherItems:
                id === 208
                  ? [
                      {
                        type: "setFieldValue",
                        slug: "case-specific-and-tactical-advise",
                        value: "no-comment-interview",
                        fieldValue: "Client advised to proceed by way of a No Comment Interview",
                      },
                      {
                        type: "setFieldValue",
                        slug: "case-specific-and-tactical-advise",
                        value: "fully-commented-interview",
                        fieldValue:
                          "Client advised to proceed by way of a Fully Commented Interview",
                      },
                      {
                        type: "setFieldValue",
                        slug: "case-specific-and-tactical-advise",
                        value: "prepared-statement",
                        fieldValue: "Client advised to proceed by way of a Prepared Statement",
                      },
                    ]
                  : undefined,
            };
          }) ?? [],
      };
    // Telephone Note
    case "29":
      return {
        // Telephone Note 123
        131:
          fields.map(({ id, slug }) => {
            let className = "form-item";
            if ([1295, 1294, 1625, 1291, 1289, 1290, 1292, 1293].includes(id)) {
              className = "form-item-4";
            }
            if (id === 1296) {
              className = "";
            }
            return {
              slug,
              className,
              disabled: slug === "cost-band",
              isTextArea: slug === "message",
            };
          }) ?? [],
      };
    default:
      return {} as Record<number, ItemsDataI[]>;
  }
};

export const getExtendedDefaultValue = (
  defaultValue: string,
  formId: string,
  sectionId: number,
  fieldId: number
) => {
  const extendedDefaultValues: Record<string, Record<number, Record<number, string>>> = {
    "4": {
      45: {
        205: `Abduction by a person connected with the child
In order to be convicted of this offence the prosecution must prove that you, as a parent or person connected with a child (under 16 years age), took or sent the child out of the United Kingdom without the appropriate consent.

If you are accused of this offence in the capacity of a parent, the appropriate consent may to take the child abroad may be required from the other parent, any guardian of the child, any person named in child care arrangements, or any person who has lawful custody of the child.`,
      },
    },
  };
  return extendedDefaultValues[formId]?.[sectionId]?.[fieldId] ?? defaultValue;
};
