'use server';
import nodemailer from 'nodemailer';
const SMTP_SERVER_USERNAME = process.env.EMAIL_USER
const SMTP_SERVER_PASSWORD = process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Hoặc 465 nếu dùng SSL
  secure: false, // True cho cổng 465, false cho cổng khác
  auth: {
    user: SMTP_SERVER_USERNAME || 'your-email@gmail.com', // Đọc từ biến môi trường hoặc đặt giá trị cố định
    pass: SMTP_SERVER_PASSWORD || 'your-password-or-app-password', // Mật khẩu ứng dụng hoặc mật khẩu tài khoản
  },
});

export async function sendMail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo?: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }
  const info = await transporter.sendMail({
    from: SMTP_SERVER_USERNAME,
    to: sendTo ,
    subject: subject,
    text: text || '',
    html: html || '',
  });
  return info;
}