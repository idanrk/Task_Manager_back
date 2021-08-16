const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox5523d88dcbd148289089a53e96dc1dac.mailgun.org';
const mg = mailgun({ apiKey: '23a6aa779428070a1b46fc53e1c0f991-9776af14-9fb92156', domain: DOMAIN });
exports.welcomeEmail = async(email, name) => {
    try {
        await mg.messages().send({
            from: 'Task Manager <Task_Manager@taskmanager.com>',
            to: email,
            subject: 'Task Manager - Welcome to Task Manager!',
            text: `Hi ${name}, Thank you for joining us!.`
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}

exports.deletionMail = async(email, name) => {
    try {
        await mg.messages().send({
            from: 'Task Manager <Task_Manager@taskmanager.com>',
            to: email,
            subject: 'Task Manager - Your account has been deleted!',
            text: `Hi ${name}, Sorry to see you leave... would you mind send us an email back why you decided to leave?`
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}