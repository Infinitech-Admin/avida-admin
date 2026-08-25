import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetLink?: string;
  resetToken?: string;
}

export const ResetPasswordEmail = ({
  resetLink = "https://avida-admin.vercel.app/auth/reset-password",
  resetToken,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://infinitech-api27.site/logo/avida-logo-only.png"
          width="170"
          height="170"
          alt="AVIDA Logo"
          style={logo}
        />
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>Hello</Text>
        <Text style={text}>
          We received a request to reset your password for your AVIDA account.
          If you didn't make this request, you can safely ignore this email.
        </Text>
        <Text style={text}>
          To reset your password, click the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={`${resetLink}/${resetToken}`}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This password reset link will expire in 24 hours. If you need to reset
          your password after that, please request a new reset link.
        </Text>
        <Text style={text}>
          If you're having trouble clicking the button, copy and paste the
          following link into your web browser:
        </Text>
        <Text style={link}>{`${resetLink}/${resetToken}`}</Text>
        <Text style={text}>
          If you have any questions or need further assistance, please don't
          hesitate to contact our support team.
        </Text>
        <Text style={text}>Thank you for choosing AVIDA!</Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 AVIDA. All rights reserved.
          <br />
          Philippines
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#0070f3",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
