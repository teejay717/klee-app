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

export interface ExpenseDebtItem {
  payerName: string
  aiSummary: string
  amount: string
}

interface ExpenseDigestEmailProps {
  debtorName: string
  debts: ExpenseDebtItem[]
}

export const ExpenseReminderEmail = ({
  debtorName = "Roommate",
  debts = [
    {
      payerName: "Alex",
      aiSummary: "the monthly internet bill",
      amount: "250.00",
    },
  ],
}: ExpenseDigestEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        ₱ Settlement Reminder: Pending apartment balances detected
      </Preview>
      <Container style={container}>
        <Section style={box}>
          <Text style={brandHeader}>Klee - Apartment Tracker</Text>
          <Hr style={hr} />

          <Text style={paragraph}>
            Hey <strong>{debtorName}</strong>,
          </Text>
          <Text style={paragraph}>
            This is a friendly system notification regarding outstanding shared
            expenses logged exactly 6 days ago. You have{" "}
            <strong>{debts.length}</strong> balances pending settlement:
          </Text>

          {/* Clean bulleted breakdown matching the chore list padding */}
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            {debts.map((item, idx) => (
              <li key={idx} style={listItem}>
                Owe <strong>{item.payerName}</strong>:{" "}
                <span style={cashHighlight}>
                  ₱
                  {parseFloat(item.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>{" "}
                for <em>{item.aiSummary}</em>
              </li>
            ))}
          </ul>

          <Text style={paragraph}>
            Please coordinate directly with your roommates or transfer balances
            via your usual digital channels when you get a chance.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>Klee Apartment Management Platform</Text>
          <Hr style={hr} />
          <Text style={footerSubtext}>
            This is an automated notification. Please do not reply directly to
            this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ExpenseReminderEmail

// --- MATCHING STRIPE PLATFORM LAYOUT STYLING ---
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
  color: "#3695e3", // Currency / Ledger Green Accent
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
  marginBottom: "6px",
}

const cashHighlight = {
  color: "#3695e3",
  fontWeight: "bold",
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
