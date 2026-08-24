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

interface ListingApprovalEmailProps {
  name: string;
  email: string;
}

export const ListingApprovalEmail = ({
  name,
  email,
}: ListingApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>Your listing with DMCI Homes is approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://infinitech-api6.site/logo/dmci-logo-only.png"
          height="170"
          alt="DMCI Homes Logo"
          style={logo}
        />
        <Heading style={h1}>Your Listing is Approved!</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          Congratulations! We're pleased to inform you that your listing has
          been approved and is now live on DMCI Homes' platform.
        </Text>
        {/* <Section style={buttonContainer}>
          <Link style={button} href={`dmcihomes.com/dashboard/${email}`}>
            View Your Listing
          </Link>
        </Section> */}
        <Text style={text}>
          You can now log in to your account to manage your listing and explore
          all the features available to you.
        </Text>
        <Text style={text}>
          If you have any questions or need further assistance, feel free to
          reach out to our support team.
        </Text>
        <Text style={text}>Thank you for choosing DMCI Homes!</Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 DMCI Homes. All rights reserved.
          <br />
          Philippines
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ListingApprovalEmail;

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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
