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
  Link,
  Button,
} from "@react-email/components";

import * as React from "react";

interface NewPropertyEmailProps {
  name: string;
  slogan: string;
  location: string;
  description: string;
  email: string;
}

export const NewPropertyEmail = ({
  name,
  slogan,
  location,
  description,
  email,
}: NewPropertyEmailProps) => (
  <Html>
    <Head />
    <Preview>A New Property Has Been Added</Preview>
    <Body style={main}>
      <Container style={container}>
        <table
          width="100%"
          style={{
            marginBottom: "24px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <tr style={{ verticalAlign: "bottom" }}>
            <td
              style={{
                width: "80px",
                paddingRight: "10px",
                verticalAlign: "bottom",
              }}
            >
              <Img
                alt="AVIDA Logo"
                height="80"
                src="https://infinitech-api27.site/logo/avida-logo-only.png"
                style={{ display: "block", margin: "0 auto" }}
              />
            </td>
            <td style={{ verticalAlign: "bottom" }}>
              <Text
                style={{
                  color: "#03329E",
                  fontSize: "48px",
                  fontWeight: 700,
                  textDecoration: "underline",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "5px",
                  textAlign: "left",
                  lineHeight: "1.2",
                  margin: "0",
                }}
              >
                AVIDA
              </Text>
            </td>
          </tr>
        </table>

        <Text style={text}>Good Day,</Text>
        <Text style={text}>
          We are excited to inform you that a new property has been added.
        </Text>
        <Text style={text}>
          <b>Property Details:</b>
        </Text>
        <Text style={text}>
          <b>Name:</b> {name}
          <br />
          <b>Slogan:</b> {slogan}
          <br />
          <b>Location:</b> {location}
          <br />
          <br />
          <b>Description:</b> {description}
        </Text>

        <Hr style={hr} />
        <Text style={paragraph}>
          Stay tuned for our upcoming newsletters, and feel free to reach out if
          you have any questions or specific property preferences.
        </Text>
        <Button href="https://staging-avida.vercel.app/" style={button}>
          Visit Our Website
        </Button>
        <Hr style={hr} />
        <Text>
          If you ever wish to unsubscribe, you can do so by clicking{" "}
          <Link
            href={`https://staging-avida.vercel.app/subscription?email=${email}`}
          >
            here
          </Link>
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

export default NewPropertyEmail;

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
const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};
