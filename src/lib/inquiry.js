import { addDays, formatDate } from './dates'

export const FITTING_OPTIONS = [
  { value: 'fitting', label: 'I would like a fitting (₱100, refundable if I proceed with the rental)' },
  { value: 'none', label: 'No fitting. I understand Missche is not responsible for sizing issues without one' },
  { value: 'undecided', label: 'I am not sure yet' },
]

/** Standard 3-day rental: Day 1 pickup, Day 2 event, Day 3 return. */
export function rentalSchedule(pickup) {
  return pickup ? { event: addDays(pickup, 1), ret: addDays(pickup, 2) } : { event: '', ret: '' }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns { field: message } for every problem; empty object when the form is valid. */
export function validateInquiry(form, today) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your full name.'
  if (!EMAIL.test(form.email.trim())) errors.email = 'Please enter a valid email address.'
  if (form.phone.trim() && !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim())) errors.phone = 'Use digits, spaces, + or - only.'
  if (!form.dressId) errors.dressId = 'Please choose a dress.'
  if (!form.pickup) errors.pickup = 'Please choose a pickup date.'
  else if (form.pickup < today) errors.pickup = 'Pickup cannot be in the past.'
  if (!form.event) errors.event = 'Please choose your event date.'
  else if (form.pickup && form.event < form.pickup) errors.event = 'The event date cannot be before pickup.'
  if (!form.ret) errors.ret = 'Please choose a return date.'
  else if (form.event && form.ret < form.event) errors.ret = 'The return date cannot be before the event.'
  if (!form.fitting) errors.fitting = 'Please choose a fitting preference.'
  if (!form.agree) errors.agree = 'Please agree to the Terms & Conditions to continue.'
  return errors
}

export function buildInquiry(form, dress) {
  const fitting = FITTING_OPTIONS.find((o) => o.value === form.fitting)?.label ?? ''
  const subject = `Rental inquiry: ${dress.name} (${dress.code}), pickup ${formatDate(form.pickup)}`
  const body = [
    'RENTAL INQUIRY (not a booking)',
    '',
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    form.phone.trim() && `Contact number: ${form.phone.trim()}`,
    '',
    `Dress: ${dress.name}`,
    `Dress code: ${dress.code}`,
    `Pickup (Day 1): ${formatDate(form.pickup)}`,
    `Event (Day 2): ${formatDate(form.event)}`,
    `Return (Day 3): ${formatDate(form.ret)}`,
    `Fitting: ${fitting}`,
    '',
    form.message.trim() && `Message: ${form.message.trim()}`,
    form.message.trim() && '',
    'I have read and agree to the Terms & Conditions.',
  ].filter((line) => line !== false && line !== undefined).join('\r\n')
  return { subject, body }
}

export const inquiryText = ({ subject, body }) => `Subject: ${subject}\r\n\r\n${body}`

export const mailtoHref = (email, { subject, body }) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
