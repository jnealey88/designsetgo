# Form Builder

Create powerful, secure forms with AJAX submission, spam protection, and email notifications. Our Form Builder provides all the essential field types with a WordPress-native interface.

---

## Form Builder Block

**The container for creating custom forms**

Build contact forms, surveys, registration forms, and more with our flexible Form Builder. Features AJAX submission for a seamless user experience, built-in spam protection with honeypot and rate limiting, and optional email notifications.

### Key Features

- **AJAX submission** - No page reload, smooth user experience
- **Spam protection** - Honeypot fields and rate limiting built-in
- **Email notifications** - Send form submissions to any email address
- **Customizable styling** - Control colors, spacing, and field appearance
- **Success/error messages** - Fully customizable feedback messages
- **Flexible layout** - Use any WordPress blocks between form fields
- **Accessibility first** - Proper labels, ARIA attributes, and keyboard navigation

### Form Settings

- **Submit button** - Custom text, alignment, and colors
- **Field styling** - Heights, padding, borders, backgrounds
- **Spacing control** - Gap between form fields
- **Email setup** - Recipients, subject, reply-to, custom body
- **Security options** - Enable/disable honeypot and rate limiting

### Demo

[Placeholder for Form Builder demo]

---

## Available Form Fields

### Text Field
Standard single-line text input for names, titles, or short responses.
- Required/optional toggle
- Placeholder text
- Custom validation
- Min/max length

### Email Field
Email input with built-in validation to ensure proper email format.
- Automatic email validation
- Required/optional toggle
- Placeholder text
- Used for reply-to functionality

### Phone Field
Phone number input with optional formatting.
- Pattern validation
- Required/optional toggle
- Custom formats supported

### Number Field
Numeric input with min/max constraints.
- Minimum and maximum values
- Step increments
- Required/optional toggle

### URL Field
Website URL input with automatic validation.
- URL format validation
- Required/optional toggle
- Placeholder for example URLs

### Date Field
Date picker for scheduling and appointments.
- Native date picker
- Min/max date constraints
- Custom date formats

### Time Field
Time picker for scheduling.
- Native time picker
- 12/24 hour format support
- Step increments

### Textarea
Multi-line text input for messages and longer content.
- Adjustable rows
- Character/word limits
- Required/optional toggle
- Placeholder text

### Select Field (Dropdown)
Dropdown menu for choosing from predefined options.
- Multiple options
- Custom option labels and values
- Default selection
- Required/optional toggle

### Checkbox Field
Single checkbox for agreements, confirmations, or boolean choices.
- Required/optional toggle
- Custom label text
- Use for terms acceptance

### File Upload
File upload field for documents, images, or other attachments.
- File type restrictions
- File size limits
- Multiple file upload support
- Required/optional toggle

### Hidden Field
Hidden input for tracking data or passing information.
- Not visible to users
- Useful for tracking sources, page IDs, etc.
- Value set in editor

---

## Use Cases

### Contact Forms
Simple contact form with name, email, subject, and message fields.

### Registration Forms
Collect detailed information with multiple field types including file uploads.

### Survey Forms
Gather feedback with checkboxes, dropdowns, and text areas.

### Booking Forms
Use date and time fields for appointment scheduling.

### Lead Generation
Capture leads with targeted fields and hidden tracking data.

---

## Security Features

### Honeypot Protection
Invisible field that catches bots while remaining hidden from real users.

### Rate Limiting
Prevents form spam by limiting submission frequency per IP address.
- Configurable submission limit
- Adjustable time window
- Automatic IP tracking

### Data Sanitization
All form data is sanitized before processing to prevent XSS and injection attacks.

### Email Validation
Built-in validation ensures email addresses are properly formatted.

---

## Email Notifications

Configure the form to send email notifications when submitted:

- **Recipients** - Send to multiple email addresses
- **Subject line** - Dynamic or static subject
- **From name** - Customize sender name
- **From email** - Set reply address
- **Email body** - Custom HTML email template with form data

All form submissions include complete field data with proper formatting.

---

## Best Practices

1. **Keep forms short** - Only ask for essential information
2. **Clear labels** - Use descriptive field labels
3. **Mark required fields** - Make it obvious which fields are mandatory
4. **Helpful placeholders** - Provide examples in placeholder text
5. **Success feedback** - Always show a confirmation message
6. **Test thoroughly** - Check all validations and email delivery
7. **Enable spam protection** - Always use honeypot and rate limiting
8. **Accessible design** - Ensure keyboard navigation and screen reader support
