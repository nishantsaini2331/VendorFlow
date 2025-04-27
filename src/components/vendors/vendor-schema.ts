import { z } from "zod";

export const vendorSchema = z.object({
  vendorName: z.string().min(1, { message: "Vendor name is required" }),
  bankAccountNo: z
    .string()
    .min(1, { message: "Bank account number is required" }),
  bankName: z.string().min(1, { message: "Bank name is required" }),
  addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
  addressLine2: z.string().min(1, { message: "Address line 2 is required" }),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;

export interface Vendor extends VendorFormValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
