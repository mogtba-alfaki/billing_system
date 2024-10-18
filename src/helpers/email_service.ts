




import * as snedGrid from  '@sendgrid/mail'; 


// Set the API key (should be stored in .env file)
const snedGridApiKey = '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';
snedGrid.setApiKey(snedGridApiKey); 

export const sendEmail = async (email: string, message: string, subject: string) => {
    const msg = {
        to: email,
        from: 'billing@billing.com',
        subject: subject,
        text: message,
        html: `<string>${message}</strong>`,
    }

    try {
      snedGrid.send(msg);
    } catch (error) {
        console.error(error);
    } 
}