const supabase = require('../services/db');
const { sendWhatsAppMessage } = require('../services/twilio');

// Define the 8 onboarding steps as per PRD
const ONBOARDING_STEPS = [
  { step: 0, field: 'language_preference', question: "Hi! I'm Disha. I'm here to help you navigate college and find scholarships. Which language do you prefer? (Reply with: English, Kannada, Hindi, Telugu, or Tamil)" },
  { step: 1, field: 'full_name', question: "Great! Let's get started. What's your full name?" },
  { step: 2, field: 'college_name', question: "Nice to meet you! Which college are you attending?" },
  { step: 3, field: 'branch', question: "And what is your branch and current year? (e.g., CSE 2nd Year)" },
  { step: 4, field: 'home_district', question: "Got it. Which district is your home town in?" },
  { step: 5, field: 'family_income_bracket', question: "To help find the right scholarships, what is your family's annual income bracket?\n1. Less than ₹1 Lakh\n2. ₹1 Lakh - ₹2.5 Lakhs\n3. ₹2.5 Lakhs - ₹8 Lakhs\n4. More than ₹8 Lakhs\n(Just reply with the number)" },
  { step: 6, field: 'caste_category', question: "What is your caste category? (Reply with: SC, ST, OBC, or General)" },
  { step: 7, field: 'fee_payment_status', question: "Almost done! What is your current college fee payment status? (Reply with: Paid, Partial, or Pending)" }
];

async function handleMessage(phone, message, student) {
  try {
    // If no student record exists, create one
    if (!student) {
      const { data: newStudent, error } = await supabase
        .from('students')
        .insert([{ phone_number: phone, onboarding_step: 0 }])
        .select()
        .single();
        
      if (error) throw error;
      student = newStudent;
    }

    const currentStepIndex = student.onboarding_step;

    // If they are just starting, send the first question
    if (currentStepIndex === 0 && message.toLowerCase() === 'hi') {
      await sendWhatsAppMessage(phone, ONBOARDING_STEPS[0].question);
      return;
    }

    // Process the answer for the current step
    if (currentStepIndex > 0 || (currentStepIndex === 0 && message.toLowerCase() !== 'hi')) {
      const stepDef = ONBOARDING_STEPS[currentStepIndex];
      let valueToSave = message;

      // Simple parsing for income bracket
      if (stepDef.field === 'family_income_bracket') {
        const mapping = {
          '1': '< 1L',
          '2': '1L - 2.5L',
          '3': '2.5L - 8L',
          '4': '> 8L'
        };
        valueToSave = mapping[message.trim()] || message;
      }

      // Update student record
      const updates = { [stepDef.field]: valueToSave };
      const nextStepIndex = currentStepIndex + 1;

      if (nextStepIndex >= ONBOARDING_STEPS.length) {
        updates.onboarding_complete = true;
      } else {
        updates.onboarding_step = nextStepIndex;
      }

      const { data: updatedStudent, error: updateError } = await supabase
        .from('students')
        .update(updates)
        .eq('id', student.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Ask the next question or finish onboarding
      if (nextStepIndex < ONBOARDING_STEPS.length) {
        await sendWhatsAppMessage(phone, ONBOARDING_STEPS[nextStepIndex].question);
      } else {
        await sendWhatsAppMessage(phone, "Thank you! You're all set up. Give me a moment to check for scholarships you might be eligible for...");
        
        // Trigger scholarship matching immediately
        await runScholarshipMatch(phone, updatedStudent);
      }
    }
  } catch (error) {
    console.error('Intake Agent Error:', error);
    await sendWhatsAppMessage(phone, "Oops, something went wrong. Let's try that again later.");
  }
}

async function runScholarshipMatch(phone, student) {
  // Mock logic to trigger scholarship matching
  // In a full implementation, this would query the 'scholarships' table based on student.family_income_bracket and caste
  const matchMessage = `Good news, ${student.full_name}! You qualify for the NSP Post-Matric Scholarship worth ₹48,000. The deadline is in 18 days. Want me to help you apply? (Reply 'Yes' or 'Later')`;
  
  setTimeout(async () => {
    await sendWhatsAppMessage(phone, matchMessage);
  }, 2000);
}

module.exports = { handleMessage };
