import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

interface EmailData {
  to: string[];
  teamName: string;
  budget: number;
  spent: number;
  percentage: number;
  threshold: "80%" | "100%";
}

interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  messageId?: string;
}

export const emailService = {
  async sendBudgetAlert(data: EmailData): Promise<ServiceResult> {
    try {
      if (!data.to || data.to.length === 0) {
        return {
          success: false,
          error: "No recipients provided",
        };
      }

      const invalidEmails = data.to.filter((email) => !email.includes("@"));
      if (invalidEmails.length > 0) {
        return {
          success: false,
          error: `Invalid email addresses: ${invalidEmails.join(", ")}`,
        };
      }

      const subject =
        data.threshold === "100%"
          ? `Budget Exceeded: ${data.teamName}`
          : `Budget Warning: ${data.teamName}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: ${
            data.threshold === "100%" ? "#dc2626" : "#f59e0b"
          };">
            ${subject}
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>Team:</strong> ${data.teamName}</p>
            <p><strong>Budget:</strong> $${data.budget.toLocaleString()}</p>
            <p><strong>Spent:</strong> $${data.spent.toLocaleString()} (${
        data.percentage
      }%)</p>
            <p style="color: ${
              data.threshold === "100%" ? "#dc2626" : "#f59e0b"
            }; font-weight: bold;">
              ${
                data.threshold === "100%"
                  ? "Budget Exceeded!"
                  : "Approaching Budget Limit"
              }
            </p>
          </div>
        </div>
      `;

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = {
        name: "Team Expense Manager",
        email:
          process.env.BREVO_SENDER_EMAIL || "noreply@team-expense-manager.com",
      };
      sendSmtpEmail.to = data.to.map((email) => ({ email }));

      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

      return {
        success: true,
        messageId: response.body?.messageId,
        data: response.body,
      };
    } catch (error: any) {
      console.error("Email service error:", error);

      const errorMessage =
        error?.body?.message ||
        error?.message ||
        "Failed to send budget alert email. Please check email configuration.";

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
