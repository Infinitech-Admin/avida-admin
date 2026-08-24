// app\api\email\listing\approved\route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import { DeclinedViewingEmail } from "@/emails/decline_viewing_email";

export async function POST(req: Request) {
  const { name, email, time, property, date } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const emailHtml = await render(
    DeclinedViewingEmail({
      name: name,
      email: email,
      time: time,
      date: date,
      property: property,
    }),
  );

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "ALVEO : Your Listing is Declined!",
    html: emailHtml,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);

  return NextResponse.json({
    status: "success",
    message: "Email sent successfully",
  });
}
