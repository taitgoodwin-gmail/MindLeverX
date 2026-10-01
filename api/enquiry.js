import { createEnquiryHandler } from '../lib/enquiry.mjs';

// Deliberately separate from the private operator application and SQLite intake.
export default { fetch: createEnquiryHandler() };
