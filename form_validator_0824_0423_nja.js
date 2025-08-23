// 代码生成时间: 2025-08-24 04:23:53
class FormValidator {
  /**
   * Validates a username.
   * @param {string} username - The username to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  validateUsername(username) {
    // Simple validation: must be non-empty and not more than 15 characters.
    return typeof username === 'string' && username.length > 0 && username.length <= 15;
  }

  /**
   * Validates an email.
   * @param {string} email - The email to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  validateEmail(email) {
    // Simple regex for email validation.
    const regex = /^(([^<>()[\]\.,;:\s@"']+(\.[^<>()[\]\.,;:\s@"']+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  /**
   * Validates a password.
   * @param {string} password - The password to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  validatePassword(password) {
    // Simple validation: must be at least 8 characters long and include a number.
    const regex = /^(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  }

  /**
   * Validates form data.
   * @param {Object} formData - An object containing form data.
   * @returns {Object} An object with validation result and errors.
   */
  validateFormData(formData) {
    let errors = {};
    let isValid = true;

    if (!this.validateUsername(formData.username)) {
      errors.username = 'Username must be 1-15 characters long.';
      isValid = false;
    }

    if (!this.validateEmail(formData.email)) {
      errors.email = 'Invalid email format.';
      isValid = false;
    }

    if (!this.validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters long and include a number.';
      isValid = false;
    }

    return {
      isValid,
      errors
    };
  }
}

// Example usage:
const validator = new FormValidator();
const formData = {
  username: 'user123',
  email: 'user@example.com',
  password: 'password1'
};
const validationResult = validator.validateFormData(formData);
if (!validationResult.isValid) {
  console.error('Form validation errors:', validationResult.errors);
} else {
  console.log('Form is valid!');
}