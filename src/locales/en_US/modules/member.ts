import { message } from "typia/lib/protobuf";

export default {
  title: "Member",

  dialog: {
    edit: "Member Edit"
  },

  columns: {
    alias: "Alias",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone"
  },
  message: {
    updateSuccess: "Member Info updated."
  }
};
