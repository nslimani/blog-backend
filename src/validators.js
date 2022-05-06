import { string } from "yup";

export const emailValidator = string().email();
