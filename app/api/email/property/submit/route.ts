// app/api/email/property/submit/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { NewPropertyEmail } from "@/emails/new_property_email";

export async function POST(req: Request) {
  const { property, subscribers } = await req.json();

  console.log("🔍 Property received:", property);
  console.log("👥 Subscribers received:", subscribers);

  const emails = subscribers.map(
    (subscriber: { email: string }) => subscriber.email,
  );
  const uniqueEmails = [...new Set(emails)] as string[];

  console.log("📬 Unique Emails:", uniqueEmails);
  console.log("📩 Sending to:", uniqueEmails.join(", "));

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  for (const email of uniqueEmails) {
    // ✅ Inject the correct recipient's email into the unsubscribe link
    const emailHtml = await render(
      NewPropertyEmail({
        name: property.property.name,
        slogan: property.property.slogan,
        location: property.property_location,
        description: property.property_description,
        email: email, // ✅ Use the recipient's email here
      }),
    );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "AVIDA : New Property Notification!",
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Message sent to:", email, "| Message ID:", info.messageId);
  }

  return NextResponse.json({
    status: "success",
    message: "Email sent successfully",
  });
}
