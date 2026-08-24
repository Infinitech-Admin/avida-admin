// app\api\email\listing\approved\route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import { ListingApprovalEmail } from "@/emails/approve_listing_email";

export async function POST(req: Request) {
  const { name, email } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const emailHtml = await render(
    ListingApprovalEmail({
      name: name,
      email: email,
    }),
  );

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "ALVEO : Your Listing is Approved!",
    html: emailHtml,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  return NextResponse.json({
    status: "success",
    message: "Email sent successfully",
  });
}
