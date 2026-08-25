import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ListingDeclinedEmailProps {
  first_name?: string;
  last_name?: string;
  email: string;
  reason?: string;
  name?: string;
}

export const ListingDeclinedEmail = ({
  first_name = "Fortune Matthew",
  last_name = "Tamares",
  email = "fortunetamares@gmail.com",
  reason = "not meeting the platform guidelines",
  name,
}: ListingDeclinedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your listing with AVIDA has been declined</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://infinitech-api27.site/logo/avida-logo-only.png"
          height="170"
          alt="AVIDA Logo"
          style={logo}
        />
        <Heading style={h1}>Your Listing Has Been Declined</Heading>
        <Text style={text}>
          Hello {first_name} {last_name},
        </Text>
        <Text style={text}>
          Thank you for submitting your listing to AVIDA. After careful review,
          we regret to inform you that your listing has been declined.
        </Text>
        <Text style={text}>
          <strong>Reason for Decline:</strong> {reason}
        </Text>
        <Text style={text}>
          We encourage you to review our guidelines and make the necessary
          adjustments to ensure your listing meets our requirements.
        </Text>
        {/* <Section style={buttonContainer}>
                    <Link style={button} href={`dmcihomes.com/support`}>
                        Contact Support
                    </Link>
                </Section> */}
        <Text style={text}>
          If you have questions or need assistance, our support team is here to
          help. We look forward to helping you successfully list with us in the
          future.
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

export default ListingDeclinedEmail;

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
  backgroundColor: "#ff5c5c",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
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
