const nodemailer = require('./nodemaile.config')


// Configure the transporter
const transporter = nodemailer.createTransport({
  // service: "smtp",
  host: "mail.ict.lviv.ua",
  port: 465,
  secure: true,
  auth: {
    user: "ict-info-logistics@ict.lviv.ua",
    pass: "Tfc34#sR51",
  },
});


// Create the sendEmail function
 const sendRegistrationSuccess = async (to, subject, text) => {
  try {
    // Set up email data
    const mailOptions = {
      from: 'cargo-info@ict.lviv.ua', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = {
  sendRegistrationSuccess
}
// Example usage
// sendRegistrationSuccess('rt@ict.lviv.ua', 'https://carriers.ict.lviv.ua', 'Hello! This is a test email.');