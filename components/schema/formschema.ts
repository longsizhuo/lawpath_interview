// Zod validation schema
import {z} from "zod";

const formSchema = z.object({
    suburb: z.string().min(2, "Suburb must be at least 2 characters"),
    postcode: z.number().int().positive().gte(200).lte(9729),
    state: z.enum(["", "NSW", "VIC", "QLD", "WA", "SA", "TAS"]).default(""),
});

export default formSchema;