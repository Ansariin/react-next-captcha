const crypto = require('crypto');

function verifyCaptcha(text, hash, customSalt, captchasData) {
  const salt = customSalt || 'YEW^$HJHkjherf349&%$&^#%&578564gdfg';
  const computedHash = crypto.createHash('sha256').update(text + salt).digest('hex');

  for (let i = 0; i < captchasData.length; i++) {
    if (captchasData[i].hash === hash && !captchasData[i].isUsed) {
      captchasData[i].isUsed = true;
      if (computedHash === hash) {
        return { success: true };
      }
    }
  }

  return { success: false, message: 'Captcha verification failed' };
}

module.exports = verifyCaptcha;
