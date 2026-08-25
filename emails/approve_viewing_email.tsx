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

interface ApprovedViewingEmailProps {
  name: string;
  email: string;
  property: string;
  time: string;
  date: string;
  propertyLink?: string;
}

export const ApprovedViewingEmail = ({
  name,
  date,
  time,
  property,
  propertyLink,
}: ApprovedViewingEmailProps) => (
  <Html>
    <Head />
    <Preview>Your viewing request for {property} is approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://infinitech-api27.site/logo/dmci-logo-only.png"
          height="170"
          alt="DMCI Homes Logo"
          style={logo}
        />
        <Heading style={h1}>Viewing Approved for {property}!</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          We are excited to inform you that your request to view the property{" "}
          <b>{property}</b> has been approved!
        </Text>
        <Text style={text}>
          <b>Viewing Details:</b>
        </Text>
        <Text style={text}>
          <b>Property Name:</b> {property}
          <br />
          <b>Date:</b> {date}
          <br />
          <b>Time:</b> {time}
        </Text>
        {/* <Section style={buttonContainer}>
                    <Link style={button} href={propertyLink}>
                        View Property Details
                    </Link>
                </Section> */}
        <Text style={text}>
          Please log in to your account to check the viewing schedule or
          additional property information.
        </Text>
        <Text style={text}>
          If you have any questions or need assistance with your viewing, our
          support team is here to help.
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

export default ApprovedViewingEmail;

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
