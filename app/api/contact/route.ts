import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email";
import { storeSubmission } from "@/lib/storage";
import { validateContactPayload, type ContactPayload } from "@/lib/validation";

export const POST = async (request: Request) => {
  const payload = (await request.json()) as ContactPayload;
  const validation = validateContactPayload(payload);

  if (!validation.isValid) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    );
  }

  const submission = {
    ...payload,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString()
  };

  await storeSubmission(submission);
  await sendContactEmail(submission);

  return NextResponse.json({ ok: true });
};
