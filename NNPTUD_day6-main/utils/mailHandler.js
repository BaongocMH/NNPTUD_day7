const nodemailer = require("nodemailer");
const crypto = require("crypto");

const defaultFrom = `mailer-${crypto.randomBytes(6).toString("hex")}@random-mail.local`;

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.MAILTRAP_PORT || 2525),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_PASS || "",
    },
});

function assertMailtrapConfig() {
    if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
        throw new Error("Missing MAILTRAP_USER or MAILTRAP_PASS");
    }
}

module.exports = {
    sendMail: async (to, url) => {
        assertMailtrapConfig();
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || defaultFrom,
            to: to,
            subject: "request resetpassword email",
            text: "click vao day de reset", // Plain-text version of the message
            html: "click vao <a href="+url+">day</a> de reset", // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
    },
    sendUserPasswordMail: async (to, username, password) => {
        assertMailtrapConfig();
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || defaultFrom,
            to: to,
            subject: "Tai khoan moi cua ban",
            text: `Xin chao ${username}. Mat khau tam thoi cua ban la: ${password}`,
            html: `<p>Xin chao <b>${username}</b>.</p><p>Mat khau tam thoi cua ban la: <b>${password}</b></p>`,
        });
        console.log("Message sent:", info.messageId);
    },
    verifyMailConfig: async () => {
        assertMailtrapConfig();
        await transporter.verify();
        return true;
    }
}