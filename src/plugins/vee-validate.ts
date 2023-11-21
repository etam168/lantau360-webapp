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
  confirmed
} from "@vee-validate/rules";

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
    defineRule("confirmed", confirmed);
    defineRule("not_one_of", notOneOf);
    defineRule("passwords_mismatch", confirmed);
    defineRule("country_excluded", notOneOf);
    defineRule("tos", required);
    defineRule("not_one_of", notOneOf);

    configure({
      generateMessage: ctx => {
        console.log("required ctx", ctx);

        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is too long`,
          alpha_spaces: `The field ${ctx.field} can only contain letters and spaces`,
          email: `The field ${ctx.field} must be a valid email`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too high`,
          passwords_mismatch: "Passwords do not match",
          country_excluded: "Due to restriction, we do not accept users from this location",
          tos: "You must accept the Terms of Service"
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: true,
      validateOnModelUpdate: true
    });
  }
};
