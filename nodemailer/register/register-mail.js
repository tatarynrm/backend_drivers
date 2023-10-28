const { transporter } = require("../nodemailer");
const handlebars = require('handlebars')
const fs = require("fs");
const path = require('path')

const sendRegisterMail = async (email,password) => {
  const source = fs
    .readFileSync(('nodemailer/templates/register-template.html'), "utf-8")
    .toString();


    const template = handlebars.compile(source)
    const replacements = {
        email:'redwoolfik@gmail.com',
        password:"ab123456"
    }
    const htmlToSend = template(replacements)

    const info = await transporter.sendMail({
        from:"ict-info-logistics@ict.lviv.ua",
        to:"tatarynrm@gmail.com",
        subject:"Вітаємо з реєстрацією!",
        text:"Ваші авторизаційні дані",
        html:htmlToSend
    })
    console.log('Message send',info.response)
};

module.exports = sendRegisterMail
