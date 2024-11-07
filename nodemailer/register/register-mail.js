const { transporter } = require("../nodemailer");
const handlebars = require('handlebars')
const fs = require("fs");
const path = require('path')

const sendEmailSuccessRegister = async (email,password) => {
  const source = fs
    .readFileSync(('nodemailer/templates/register-template.html'), "utf-8")
    .toString();

    const template = handlebars.compile(source)
    const replacements = {
        email:email,
        password:password
    }
    const htmlToSend = template(replacements)

    const info = await transporter.sendMail({
        from:"cargo-info@ict.lviv.ua",
        to:[email,'rt@ict.lviv.ua'],
        subject:"Вітаємо з реєстрацією в особистому кабінеті перевізника 🚚",
        text:"Ваші авторизаційні дані",
        html:htmlToSend
    })
    console.log('Message send',info.response)
};

module.exports = {
    sendEmailSuccessRegister
}
