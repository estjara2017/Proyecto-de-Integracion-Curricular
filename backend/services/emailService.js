const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'elementalcrosstraining@gmail.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Elemental Cross Training';

const getEmailPassword = () => process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

const createTransporter = () => {
    const password = getEmailPassword();

    if (!password) {
        throw new Error('Falta configurar EMAIL_PASS con la contrasena de aplicacion de Gmail.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: password
        }
    });
};

const buildOtpEmail = ({ codigo, nombre }) => {
    const saludo = nombre ? `Hola ${nombre},` : 'Hola,';
    const text = [
        saludo,
        '',
        `Tu codigo de acceso a Elemental Cross Training es: ${codigo}`,
        '',
        'Este codigo expira en 5 minutos. Si no solicitaste iniciar sesion, puedes ignorar este correo.',
        '',
        'Elemental Cross Training'
    ].join('\n');

    const html = `
        <div style="font-family: Arial, sans-serif; color: #1f2933; line-height: 1.5;">
            <p>${saludo}</p>
            <p>Tu codigo de acceso a <strong>Elemental Cross Training</strong> es:</p>
            <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${codigo}</p>
            <p>Este codigo expira en 5 minutos.</p>
            <p style="color: #64748b;">Si no solicitaste iniciar sesion, puedes ignorar este correo.</p>
        </div>
    `;

    return { text, html };
};

const enviarCodigoOtp = async ({ para, codigo, nombre }) => {
    const transporter = createTransporter();
    const contenido = buildOtpEmail({ codigo, nombre });

    await transporter.sendMail({
        from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
        to: para,
        subject: 'Tu codigo de acceso a Elemental Cross Training',
        text: contenido.text,
        html: contenido.html
    });
};

module.exports = {
    enviarCodigoOtp
};
