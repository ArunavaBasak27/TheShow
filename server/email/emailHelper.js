import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import juice from "juice";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replaceContent = (content, credentials) => {
  return Object.keys(credentials).reduce((updatedContent, key) => {
    return updatedContent.replace(
      new RegExp(`#{${key}}`, "g"),
      credentials[key],
    );
  }, content);
};

const emailHelper = async ({ receiverEmail, templateName, credentials }) => {
  try {
    const templatePath = path.join(__dirname, "templates", templateName);
    let content = await fs.promises.readFile(templatePath, "utf8");
    content = replaceContent(content, credentials);
    content = juice(content);
    const emailPayload = {
      sender: { email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: receiverEmail }],
      subject: "Mail from The Show",
      htmlContent: content,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    console.log(
      `Email sent to ${receiverEmail}. Message ID: ${result.messageId}`,
    );
  } catch (error) {
    console.log("Email send error:", error.message);
  }
};

export default emailHelper;
