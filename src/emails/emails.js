const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });




exports.welcomeEmail = async(email, name) => {
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: 'Task Manager <Task_Manager@taskmanager.com>',
            to: [email],
            subject: 'Task Manager - Welcome to Task Manager!',
            text: `Hi ${name}, Thank you for joining us!.`
        })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deletionMail = async(email, name) => {
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: 'Task Manager <Task_Manager@taskmanager.com>',
            to: [email],
            subject: 'Task Manager - Your account has been deleted!',
            text: `Hi ${name}, Sorry to see you leave... would you mind send us an email back why you decided to leave?`
        })
    } catch (error) {
        res.status(500).send(error)
    }
}