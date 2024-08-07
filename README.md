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

## Basic Setup - (Next.js)

### A) Server-Side (Next.js API Routes)

Create API routes to generate and verify captchas:

1. **`pages/api/generate-captcha.js`**

    ```javascript
    import { createCaptcha } from 'react-next-captcha';

    export default function handler(req, res) {
      const { size, noise, ignoreChars } = req.body;

      const options = {
        size: size || 6,
        noise: noise || 2,
        ignoreChars: ignoreChars || '0o1ilIL',
      };

      // Custom salt
      const customSalt = 'your_custom_salt';

      const captcha = createCaptcha(options, customSalt);

      res.status(200).json({ captcha: captcha.data, hash: captcha.hash });
    }
    ```

2. **`pages/api/verify-captcha.js`**

    ```javascript
    import { checkCaptcha } from 'react-next-captcha';

    export default function handler(req, res) {
      const { text, hash } = req.body;

      const result = checkCaptcha(text, hash);

      res.status(200).json(result);
    }
    ```

### B) Client-Side (React Component)

Create a React component to display and refresh the captcha:

**`/index.js`**

```javascript
import { useState } from 'react';

const Captcha = () => {
  const [captcha, setCaptcha] = useState('');
  const [hash, setHash] = useState('');

  const fetchCaptcha = async () => {
    const response = await fetch('/api/generate-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setCaptcha(data.captcha);
    setHash(data.hash);
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: captcha }} />
      <button onClick={fetchCaptcha}>Generate Captcha</button>
      {/* Use the hash for verification */}
      <p>Hash: {hash}</p>
    </div>
  );
};

export default Captcha;
```

## Advanced Configuration


## Integrates in NextJs
let's create a Next.js application with a login page that integrates `react-next-captcha` and includes captcha reloading and verification upon form submission. 

### Step 1: Set Up Next.js Application

First, create a new Next.js application if you don't already have one:

```bash
npx create-next-app@latest my-next-app
cd my-next-app
```

Install the required packages:

```bash
npm install react-next-captcha
npm install axios
```

### Step 2: Create API Routes

Create the API routes to generate and verify captchas.

**`pages/api/generate-captcha.js`**

```javascript
import { createCaptcha } from 'react-next-captcha';

export default function handler(req, res) {
  const { size, noise, ignoreChars } = req.body;

  const options = {
    size: size || 6,
    noise: noise || 2,
    ignoreChars: ignoreChars || '0o1ilIL',
  };

  // Custom salt
  const customSalt = 'your_custom_salt';

  const captcha = createCaptcha(options, customSalt);

  res.status(200).json({ captcha: captcha.data, hash: captcha.hash });
}
```

**`pages/api/verify-captcha.js`**

```javascript
import { checkCaptcha } from 'react-next-captcha';

export default function handler(req, res) {
  const { text, hash } = req.body;

  const result = checkCaptcha(text, hash);

  res.status(200).json(result);
}
```

### Step 3: Create Login Component

Create a React component for the login page, including the captcha.

**`pages/login.js`**

```javascript
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [captcha, setCaptcha] = useState('');
  const [hash, setHash] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  const fetchCaptcha = async () => {
    const response = await axios.post('/api/generate-captcha');
    setCaptcha(response.data.captcha);
    setHash(response.data.hash);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/verify-captcha', {
      text: captchaInput,
      hash,
    });

    if (response.data.success) {
      // Proceed with login
      // For demonstration purposes, we'll just log the user details
      console.log('Username:', username);
      console.log('Password:', password);
      setError('');
      // Here you can add the logic to handle the actual login, e.g., an API call to your backend
    } else {
      setError('Captcha verification failed. Please try again.');
      fetchCaptcha();
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
          <button type="button" onClick={fetchCaptcha}>
            Reload Captcha
          </button>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
```

### Step 4: Initial Fetch of Captcha

Modify the `useEffect` hook in the `Login` component to fetch the captcha initially when the component mounts.

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [captcha, setCaptcha] = useState('');
  const [hash, setHash] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    const response = await axios.post('/api/generate-captcha', {
      size: 6,
      noise: 2,
      ignoreChars: '0o1ilIL',
    });
    setCaptcha(response.data.captcha);
    setHash(response.data.hash);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/verify-captcha', {
      text: captchaInput,
      hash,
    });

    if (response.data.success) {
      // Proceed with login
      // For demonstration purposes, we'll just log the user details
      console.log('Username:', username);
      console.log('Password:', password);
      setError('');
      // Here you can add the logic to handle the actual login, e.g., an API call to your backend
    } else {
      setError('Captcha verification failed. Please try again.');
      fetchCaptcha();
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
          <button type="button" onClick={fetchCaptcha}>
            Reload Captcha
          </button>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
```

### Step 5: Start the Next.js Application

Run the Next.js application:

```bash
npm run dev
```



## Why Use SVG?

- Does not require any C++ addon.
- Resulting image is smaller than JPEG image.
- Harder for captcha recognition software to decode.
