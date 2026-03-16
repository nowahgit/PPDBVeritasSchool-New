import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Email tidak terdaftar" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: token,
        reset_token_expiry: expiry,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "PPDB Veritas School <noreply@ppdbveritasschool.vercel.app>",
      to: email,
      subject: "Reset Password - PPDB Veritas School",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px">
          <h2 style="color: #1e3a8a; margin-bottom: 24px">Reset Password</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5">Halo,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5">Klik link berikut untuk reset password kamu:</p>
          <div style="margin: 32px 0">
            <a href="${resetLink}" style="background-color: #1e3a8a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px">Link berlaku selama 1 jam.</p>
          <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px">Jika kamu tidak meminta reset password, abaikan email ini.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Email berhasil dikirim" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
