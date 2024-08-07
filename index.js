// index.js
const generateCaptcha = require('./lib/generateCaptcha');
const verifyCaptcha = require('./lib/verifyCaptcha');

let captchasData = []; // Ensure captchasData is an array

function createCaptcha(options = {}, customSalt) {
  const captcha = generateCaptcha(options, customSalt);

  if (captchasData.length > 1000) {
    captchasData = []
  }
  captchasData.push({ hash: captcha.hash, isUsed: false, salt: customSalt });
  return captcha;
}

function checkCaptcha(text, hash, customSalt) {

  // Ensure captchasData is still an array
  if (!Array.isArray(captchasData)) {
    return { success: false, message: 'Internal error: captchasData is not an array' };
  }

  let captchaDataCheck = null;
  for (let i = 0; i < captchasData.length; i++) {
    if (captchasData[i].hash === hash) {
      captchaDataCheck = captchasData[i];
      break;
    }
  }


  if (!captchaDataCheck) {
    return { success: false, message: 'Captcha not found' };
  }

  return verifyCaptcha(text, hash, captchaDataCheck.salt, captchasData);
}

module.exports = {
  createCaptcha,
  checkCaptcha,
};
