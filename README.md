# react-next-captcha

![react-next-captcha](https://img.shields.io/npm/v/react-next-captcha) ![License](https://img.shields.io/npm/l/react-next-captcha)

A simple and customizable captcha generator and verifier for Node.js, designed to be used with React and Next.js applications. Built on top of `svg-captcha`, it provides an easy way to add captchas to your web application without the need for Google reCAPTCHA or C++ addons.

## Features

- Generates SVG captchas
- Customizable options for captcha size, noise, and characters
- Secure verification with custom salts
- Easy integration with Next.js and React

## Installation

Install the package using npm:

```bash
npm install react-next-captcha
```

## Basic Setup - Next.js

### A) Server-Side (Next.js API Routes)

1. Create a file `pages/api/generate-captcha.js`:

    ```javascript
    import { createCaptcha } from 'react-next-captcha';

    export default function handler(req, res) {
      const { size, noise, ignoreChars } = req.body;

      const options = {
        size: size || 6,
        noise: noise || 2,
        ignoreChars: ignoreChars || '0o1ilIL',
      };

      // Generate a custom salt for increased security
      function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
      }
      const customSalt = generateRandomString(20);

      const captcha = createCaptcha(options, customSalt);

      res.status(200).json({ captcha: captcha.data, hash: captcha.hash });
    }
    ```

2. Create a file `pages/api/verify-captcha.js`:

    ```javascript
    import { checkCaptcha } from 'react-next-captcha';

    export default function handler(req, res) {
      if (req.method === 'POST') {
        const { text, hash } = req.body;

        const verificationCaptcha = checkCaptcha(text, hash);

        if (verificationCaptcha.success === true) {
          // Proceed with login logic here

          res.status(200).json(verificationCaptcha);
        } else {
          res.status(400).json(verificationCaptcha);
        }
      }
    }
    ```

### B) Client-Side (React Component)

3. Create a login component `pages/login.js`:

    ```javascript
    import { useState, useEffect } from 'react';

    const Login = () => {
      const [captcha, setCaptcha] = useState('');
      const [hash, setHash] = useState('');
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [captchaInput, setCaptchaInput] = useState('');
      const [message, setMessage] = useState('');

      useEffect(() => {
        fetchCaptcha();
      }, []);

      const fetchCaptcha = async () => {
        const req = await fetch('/api/generate-captcha', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ size: 6, noise: 2, ignoreChars: '0o1ilIL' }),
        });
        const res = await req.json();
        setCaptcha(res.captcha);
        setHash(res.hash);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const req = await fetch('/api/verify-captcha', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: captchaInput, hash }),
        });
        const res = await req.json();
        if (res.success) {
          // Proceed with login logic here
          setMessage('Captcha verified');
          fetchCaptcha();
        } else {
          setMessage('Captcha verification failed. Please try again.');
          //fetchCaptcha();
        }
      };

      return (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <div dangerouslySetInnerHTML={{ __html: captcha }} />
              <button type="button" onClick={fetchCaptcha}>Reload Captcha</button>
            </div>
            <div>
              <label>
                Captcha:
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </label>
            </div>
            {message && <p style={{ color: 'blue' }}>{message}</p>}
            <div>
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      );
    };

    export default Login;
    ```

## Advanced Settings

You can customize the captcha generation by passing additional options. Here are some of the options available:

- `size`: Number of characters in the captcha (default: 6)
- `noise`: Number of noise lines (default: 2)
- `ignoreChars`: Characters to ignore in the captcha (default: '0o1ilIL')
- `color`: Use distinct colors for characters (default: true if background option is set)
- `background`: Background color of the captcha image

### Example:

```javascript
const options = {
  size: 6,
  noise: 3,
  ignoreChars: '0o1ilIL',
  color: true,
  background: '#cc9966',
};
const captcha = createCaptcha(options, customSalt);
```

## API Reference

### `createCaptcha(options, customSalt)`

- `options`: Object containing the captcha generation options.
- `customSalt`: Custom salt to be used for generating the hash.

Returns an object with the following properties:
- `data`: The SVG captcha data.
- `text`: The captcha text.
- `hash`: The SHA-256 hash of the captcha text combined with the salt.

### `checkCaptcha(text, hash)`

- `text`: The text entered by the user.
- `hash`: The hash of the captcha.

Returns an object with the following properties:
- `success`: Boolean indicating if the verification was successful.
- `message`: Verification message.

## License

This project is licensed under the ISC License.
```

This `README.md` file includes the basic setup for Next.js and also highlights how to use and customize the captcha generator and verifier in your application.