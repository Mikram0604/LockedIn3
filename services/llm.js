const { GoogleGenerativeAI } = require('@google/generative-ai');
try { require('dotenv').config(); } catch(e) {}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder_key');

/**
 * Generate a response using Google Gemini with fast timeout + template fallback
 */
async function generateResponse(systemPrompt, messages) {
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  // Try Gemini with a 5-second timeout
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const fullPrompt = `${systemPrompt}\n\nUser message: ${messages[messages.length - 1].content}`;
    
    // Race between Gemini and a 5-second timeout
    const result = await Promise.race([
      model.generateContent(fullPrompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);
    
    const response = result.response.text();
    console.log('Gemini response successful');
    return response;
  } catch (error) {
    console.log(`Gemini failed: ${error.message?.substring(0, 60)}. Using template.`);
  }

  // Fast template fallback
  return getTemplateResponse(userMessage);
}

function getTemplateResponse(message) {
  if (message.includes('scholarship') || message.includes('nsp') || message.includes('money') || message.includes('financial')) {
    return "Based on your profile, here are the scholarships you may be eligible for:\n\n" +
      "1. *NSP Post-Matric Scholarship* — Up to ₹48,000 | Deadline: Oct 31\n" +
      "2. *Karnataka Rajiv Gandhi Scholarship* — ₹20,000 | Deadline: Sep 30\n" +
      "3. *AICTE Pragati Scholarship (Girls)* — ₹50,000 | Deadline: Nov 15\n" +
      "4. *Vidyasiri Scholarship* — ₹15,000 | Deadline: Aug 31\n\n" +
      "Would you like me to help you apply for any of these? Just reply with the name!";
  }

  if (message.includes('fee') || message.includes('payment') || message.includes('pay') || message.includes('pending')) {
    return "I understand fee payments can be stressful. Here are some options:\n\n" +
      "1. You can request a *fee extension* from your college — this is your right, not a favour.\n" +
      "2. Apply for the *NSP Scholarship* (up to ₹48,000) which covers tuition.\n" +
      "3. Check if your college has an *installment plan*.\n\n" +
      "Want me to guide you through requesting a fee extension or applying for a scholarship?";
  }

  if (message.includes('apply') || message.includes('help') || message.includes('how') || message.includes('guide')) {
    return "I'd love to help! Here's what I can guide you through:\n\n" +
      "1. *Scholarship applications* — step by step on WhatsApp\n" +
      "2. *Fee extension requests* — how to approach the office\n" +
      "3. *College processes* — internal assessments, library, etc.\n\n" +
      "Just tell me what you need help with!";
  }

  if (message.includes('deadline') || message.includes('date') || message.includes('when')) {
    return "Here are the upcoming deadlines you should know about:\n\n" +
      "📅 *Vidyasiri Scholarship* — Aug 31, 2026\n" +
      "📅 *Karnataka Rajiv Gandhi* — Sep 30, 2026\n" +
      "📅 *NSP Post-Matric* — Oct 31, 2026\n" +
      "📅 *AICTE Pragati* — Nov 15, 2026\n\n" +
      "Don't miss these! Want me to help you apply for any?";
  }

  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return "Hey! I'm Disha, your college companion. 🙏\n\nI can help you with:\n• Finding scholarships you qualify for\n• Step-by-step application guidance\n• Fee extensions and college processes\n\nWhat would you like to know?";
  }

  if (message.includes('thank') || message.includes('thanks')) {
    return "You're welcome! I'm always here whenever you need help. Your success matters! 💪";
  }

  if (message.includes('later') || message.includes('bye') || message.includes('ok') || message.includes('no')) {
    return "No problem! I'll be right here whenever you need me. Remember — you've got this! 🙌";
  }

  return "I'm here to help you with college — scholarships, fees, deadlines, or applications.\n\nTry asking me:\n• \"What scholarships can I get?\"\n• \"Help me apply for NSP\"\n• \"When are the deadlines?\"\n• \"How do I request a fee extension?\"";
}

module.exports = { generateResponse };
