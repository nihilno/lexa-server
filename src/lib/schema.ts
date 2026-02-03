import { z } from "zod";
const FormSchema = z.object({
  fromStreet: z
    .string()
    .min(3, "Street address must be at least 3 characters long.")
    .max(100),
  fromCity: z
    .string()
    .min(3, "City must be at least 3 characters long.")
    .max(100),
  fromPostCode: z
    .string()
    .min(3, "Post code must be at least 3 characters long.")
    .max(100),
  fromCountry: z
    .string()
    .min(3, "Country must be at least 3 characters long.")
    .max(100),

  toName: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(100),
  toEmail: z.email(),
  toStreet: z
    .string()
    .min(3, "Street address must be at least 3 characters long.")
    .max(100),
  toCity: z
    .string()
    .min(3, "City must be at least 3 characters long.")
    .max(100),
  toPostCode: z
    .string()
    .min(3, "Post code must be at least 3 characters long.")
    .max(100),
  toCountry: z
    .string()
    .min(3, "Country must be at least 3 characters long.")
    .max(100),

  issueDate: z.coerce.date(),
  paymentTerms: z.enum(["Net 1", "Net 7", "Net 14", "Net 30"]),
  projectDescription: z
    .string()
    .min(3, "Project description must be at least 3 characters long.")
    .max(200),

  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required.").max(100),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1.")
          .max(99, "Quantity must be at most 99."),
        price: z.number().min(1, "Price must be at least 1.").max(999999),
      }),
    )
    .min(1, "At least one item is required."),
});

type FormSchemaType = z.infer<typeof FormSchema>;
export { FormSchema, type FormSchemaType };
