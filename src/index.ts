import { Elysia, t } from "elysia";
import nodemailer from "nodemailer";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/send_email", async ({ body }) => {
    const { receiver, content } = body;

    if (!process.env.EMAIL || !process.env.PW) {
      throw new Error("EMAIL and PW environment variables must be set");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PW
      }
    });

    const mailOptions = {
      from: {
        name: 'Algo Network',
        address: process.env.EMAIL
      },
      to: receiver,
      subject: "New Email!",
      text: "Email from AlgoNetwork",
      html: `<div>
                <div style="text-align: center;">
                    <h2>😆 Selamat bakureh(bekerja) guys 😆</h2>
                    <p>${content}</p>
                    <img src="https://i.pinimg.com/originals/a0/70/7d/a0707d977bccdce919e8a380ca92d139.gif" alt="semangat guys">
                    <br>
                    <p>😊 Semangaaat, happy coding 😊</p>
                </div>
             </div>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Success Sending Email to: ${receiver}`);
      return {
        status: {
          code: 200,
          message: `Success Sending Email to: ${receiver}`
        },
        data: null
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        status: {
          code: 500,
          message: "Failed to send email"
        },
        data: null
      };
    }
  }, {
    body: t.Object({
      receiver: t.String(),
      content: t.String()
    })
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
