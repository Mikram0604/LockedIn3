const ONBOARDING_STEPS = [
  { step: 0, field: 'language_preference', question: "Hi! I'm Disha 🙏 I'm here to help you navigate college and find scholarships you deserve. Which language do you prefer?\n\n(Reply with: English, Kannada, Hindi, Telugu, or Tamil)" },
  { step: 1, field: 'full_name', question: "Great! Let's get started. What's your full name?" },
  { step: 2, field: 'college_name', question: "Nice to meet you! Which college are you attending?" },
  { step: 3, field: 'branch', question: "And what is your branch and current year? (e.g., CSE 2nd Year)" },
  { step: 4, field: 'home_district', question: "Got it. Which district is your home town in?" },
  { step: 5, field: 'family_income_bracket', question: "To help find the right scholarships, what is your family's annual income bracket?\n\n1. Less than ₹1 Lakh\n2. ₹1 Lakh - ₹2.5 Lakhs\n3. ₹2.5 Lakhs - ₹8 Lakhs\n4. More than ₹8 Lakhs\n\n(Just reply with the number)" },
  { step: 6, field: 'caste_category', question: "What is your caste category?\n\n(Reply with: SC, ST, OBC, or General)" },
  { step: 7, field: 'fee_payment_status', question: "Almost done! What is your current college fee payment status?\n\n(Reply with: Paid, Partial, or Pending)" }
];

const NSP_FLOW = [
  { step: 1, prompt: "Okay, let's apply for the NSP Scholarship! First, do you have your Aadhaar card and a recent passport-size photo ready?\n\n(Reply 'Yes' or 'No')" },
  { step: 2, prompt: "Great. Next, do you have a bank account in your own name?\n\n(Reply 'Yes' or 'No')" },
  { step: 3, prompt: "Perfect. Now, please visit scholarships.gov.in and click on 'New Registration'. Have you reached the page?" },
  { step: 4, prompt: "Fill in the basic details (Name, DOB, Mobile). When asked for 'Scheme Type', choose 'Post-Matric'. Let me know when you've submitted the first page." },
  { step: 5, prompt: "Awesome! You should have received an Application ID via SMS. Keep that safe! You've completed the first stage. 🎉\n\nLog in with that ID to upload your documents. Let me know when you are done!" }
];

module.exports = { ONBOARDING_STEPS, NSP_FLOW };
