// generateCaptcha.js
const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');

function generateCaptcha(options = {}, customSalt) {
  const salt = customSalt || 'YEW^$HJHkjherf349&%$&^#%&578564gdfg';
  const captchaOptions = {
    size: options.size || 6,
    noise: options.noise || 2,
    ignoreChars: options.ignoreChars || '0o1ilIL',
    ...options,
  };

  const captcha = svgCaptcha.create(captchaOptions);
  const hash = crypto.createHash('sha256').update(captcha.text + salt).digest('hex');

  return {
    data: captcha.data,
    text: captcha.text,
    hash,
  };
}

module.exports = generateCaptcha;
