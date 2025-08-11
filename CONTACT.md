# Contact Form Configuration

This portfolio website uses [Web3Forms](https://web3forms.com) for contact form submissions, which is a free, static-friendly form backend service that works perfectly with GitHub Pages.

## Setup Instructions

### 1. Get Your Web3Forms Access Key

1. Visit [web3forms.com](https://web3forms.com)
2. Click "Get Started for Free"
3. Enter your email address to receive your free access key
4. Check your email for the access key

### 2. Configure the Access Key

1. Open `index.html` in your repository
2. Find the contact form section (around line 880)
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key:

```html
<input type="hidden" name="access_key" value="YOUR_ACTUAL_ACCESS_KEY">
```

### 3. Optional: Domain Verification

For additional security and to prevent unauthorized use of your access key:

1. Log into your Web3Forms dashboard
2. Add your domain (`yourdomain.com` or `username.github.io`)
3. This ensures forms can only be submitted from your verified domain

### 4. Testing

#### Test Without JavaScript (Progressive Enhancement)
1. Disable JavaScript in your browser
2. Fill out and submit the contact form
3. You should be redirected to a Web3Forms success page

#### Test With JavaScript (Enhanced Experience)
1. Enable JavaScript
2. Fill out and submit the contact form
3. You should see an inline success message without page redirect

## Features

### Spam Protection
- **Honeypot Field**: Hidden checkbox that bots might fill out
- **Timestamp Check**: Prevents too-quick submissions (minimum 2 seconds)
- **Domain Verification**: When configured, only allows submissions from your domain

### Accessibility
- Proper ARIA labels and error states
- Screen reader compatible success/error messages
- Keyboard navigation support

### Form Validation
- Client-side validation for immediate feedback
- Required field validation
- Email format validation
- Graceful degradation if JavaScript is disabled

### Autocomplete Support
- Uses WHATWG-compliant autocomplete attributes
- Supports browser autofill for common fields:
  - `name`: Full name
  - `email`: Email address
  - `organization`: Company name

## Alternative Services

If you prefer a different service, you can easily replace Web3Forms with:

### Formspree
1. Sign up at [formspree.io](https://formspree.io)
2. Change the form action to: `https://formspree.io/f/YOUR_FORM_ID`
3. Update `contact-form.js` to handle Formspree's response format

### EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Replace the form submission with EmailJS SDK calls
3. More complex setup but offers more customization

## Troubleshooting

### Form Not Working
1. Check browser console for errors
2. Verify your access key is correct
3. Ensure your domain is added to Web3Forms (if using domain verification)

### Emails Not Received
1. Check your spam folder
2. Verify the email address associated with your Web3Forms account
3. Test with a simple message first

### JavaScript Errors
1. Check that `contact-form.js` is loading correctly
2. Verify that `unload-compat.js` is loaded before other scripts
3. Check browser console for specific error messages

## Security Notes

- Never commit your access key to public repositories if it contains sensitive information
- Use environment variables or GitHub Secrets for production deployments
- Consider adding CAPTCHA for high-traffic sites
- The current implementation includes basic spam protection but may need enhancement for heavily targeted sites

## Support

- Web3Forms Documentation: [docs.web3forms.com](https://docs.web3forms.com)
- For portfolio-specific issues: Check the repository issues
- For Web3Forms issues: Contact their support team