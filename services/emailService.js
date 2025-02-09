import nodemailer from "nodemailer";

export default function sendReminderEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "farisabdillah51@gmail.com",
      pass: "tmsi zton deqb wlwh",
    },
  });

  const mailOptions = {
    from: "farisabdillah51@gmail.com",
    to: email,
    subject: "Reminder: Clock-in Time",
    text: "It's time to clock-in!",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email", err);
    } else {
      console.log("Email sent", info.response);
    }
  });
}
