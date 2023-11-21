import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from "vee-validate";

import {
  required,
  min,
  max,
  not_one_of as notOneOf,
  min_value as minValue,
  max_value as maxValue,
  alpha_spaces as alphaSpaces,
  email,
  confirmed,
  between,
  numeric,
  regex
} from "@vee-validate/rules";

import { phoneNumber } from "./rules/phone-number";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minValue);
    defineRule("max_value", maxValue);
    defineRule("min_voucher_value", minValue);
    defineRule("max_voucher_value", maxValue);
    defineRule("min_coupon_discount", minValue);
    defineRule("max_coupon_discount", maxValue);
    defineRule("max_groupId", maxValue);
    defineRule("max_input", max);
    defineRule("confirmed", confirmed);
    defineRule("not_one_of", notOneOf);
    defineRule("passwords_mismatch", confirmed);
    defineRule("country_excluded", notOneOf);
    defineRule("tos", required);
    defineRule("between", between);
    defineRule("phone_number", phoneNumber);
    defineRule("numeric", numeric);
    defineRule("regex", regex);

    configure({
      generateMessage: ctx => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} may not be greater than {min} characters`,
          alpha_spaces: `The field ${ctx.field} can only contain letters and spaces`,
          email: `The field ${ctx.field} must be a valid email`,
          min_value: `The field ${ctx.field} is too`,
          max_value: `The field ${ctx.field} is too high`,
          min_voucher_value: `Minimum voucher value is 50`,
          max_voucher_value: `Maximum voucher value is 1000`,
          min_coupon_discount: `Minimum ${ctx.field} should be greater than 0`,
          max_coupon_discount: `Maximum ${ctx.field} should be less than 100`,
          max_groupId: `Maximum ${ctx.field} should be 4 or less than 4`,
          max_input: `The field ${ctx.field} may not be greater than 15 characters`,
          passwords_mismatch: "Passwords do not match",
          country_excluded: "Due to restriction, we do not accept users from this location",
          tos: "You must accept the Terms of Service",
          between: `${ctx.field} should be between {min} and {max} `,
          phone_number: `Invalid phone number `,
          numeric: `${ctx.field} should be number`,
          regex: `${ctx.field} Sorry, you are allowed this {regex}`
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    });
  }
};
