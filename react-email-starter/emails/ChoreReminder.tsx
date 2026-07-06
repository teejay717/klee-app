import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "react-email"

interface ChoreDigestEmailProps {
  userName: string
  choreTitles: string[]
}

export const ChoreDigestEmail = ({
  userName = "Roommate",
  choreTitles = ["Clean Kitchen", "Take out the trash"],
}: ChoreDigestEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{`📅 Daily Briefing: You have ${choreTitles.length} tasks due today!`}</Preview>
      <Container style={container}>
        <Section style={box}>
          <Text style={brandHeader}>Klee - Apartment Tracker</Text>
          <Hr style={hr} />

          <Text style={paragraph}>
            Hey <strong>{userName}</strong>,
          </Text>
          <Text style={paragraph}>
            Here is your automated morning checklist. You have{" "}
            <strong>{choreTitles.length}</strong> {`assigned task(s) due today`}
            :
          </Text>

          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            {choreTitles.map((title, idx) => (
              <li key={idx} style={listItem}>
                <strong>{title}</strong>
              </li>
            ))}
          </ul>

          <Text style={paragraph}>
            Please check them off in your dashboard interface once they are
            completed so the shared tracker stays accurate.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>— Terminal Intelligence Core</Text>
          <Hr style={hr} />
          <Text style={footerSubtext}>
            Automated Apartment Terminal Intelligence System • Live Cron Routine
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ChoreDigestEmail

// --- STRIPE SIGNATURE STYLING ARCHITECTURE ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const box = {
  padding: "0 48px",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const brandHeader = {
  color: "#3695e3", // Your Indigo brand accent
  fontSize: "14px",
  fontWeight: "bold",
  letterSpacing: "1px",
}

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
}

const listItem = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "4px",
}

const footer = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
}

const footerSubtext = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
}
