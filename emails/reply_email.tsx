import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReplyEmailProps {
  message: string;
  first_name: string;
}

export const ReplyEmail = ({ message, first_name }: ReplyEmailProps) => (
  <Html>
    <Head />
    <Preview>Response to Your Inquiry</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://infinitech-api27.site/logo/avida-logo-only.png"
          height="80"
          alt="AVIDA Logo"
          style={logo}
        />

        <Text style={text}>Good Day, {first_name}</Text>

        <Text style={text}>
          Thank you for reaching out to AVIDA. We have received your inquiry and
          we truly appreciate your interest in our properties.
        </Text>

        <Text style={text}>
          <b>Your Message:</b>
          <br />
          {message}
        </Text>

        <Text style={text}>
          Please note that this is an initial response, and a representative
          will get in touch with you shortly to provide further assistance or
          clarification if needed.
        </Text>

        <Text style={text}>
          Should you have any immediate concerns or additional questions, feel
          free to respond to this email or contact us directly through our
          official channels.
        </Text>

        <Text style={text}>
          Thank you for considering AVIDA. We look forward to assisting you.
        </Text>

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

export default ReplyEmail;

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

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "left" as const,
};
