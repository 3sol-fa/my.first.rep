'use server';

import { InquirySchema } from "@/lib/zod-schema";
import { prisma } from "@/lib/prismaClient";

export type ActionResult = { success: true; errors: null; } | { success: false; errors: Record<string, string[]>; };

export async function submitInquiry(
    prevState: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    };

    const result = InquirySchema.safeParse(raw);
    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        }
    }

    await prisma.inquiry.create({
        data: result.data
    })

    return {
        success: true,
        errors: null,
    }

}