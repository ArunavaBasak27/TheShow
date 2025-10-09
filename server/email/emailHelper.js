import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

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
    const emailDetails = {
      from: process.env.GMAIL_USER,
      to: receiverEmail,
      subject: "Mail from The Show",
      html: content,
    };
    await transport.sendMail(emailDetails);
    console.log(`Email sent from: ${emailDetails.from} to ${emailDetails.to}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default emailHelper;
