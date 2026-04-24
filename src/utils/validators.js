import { REPORT_VALIDATION_RULES } from './constants';

export const isValidEmail = (email = '') => {
  return /\S+@\S+\.\S+/.test(email.trim());
};

export const validateReport = (report) => {
  if (!report.title || report.title.trim().length < REPORT_VALIDATION_RULES.TITLE_MIN) {
    return 'Title should be at least 3 characters.';
  }

  if (
    !report.description ||
    report.description.trim().length < REPORT_VALIDATION_RULES.DESC_MIN
  ) {
    return 'Description should be at least 10 characters.';
  }

  if (!report.category) {
    return 'Please select a category.';
  }

  if (!report.status) {
    return 'Please choose lost or found.';
  }

  return null;
};
