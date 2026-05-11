const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder_key',
});

/**
 * Generate a response using Claude
 * @param {string} systemPrompt 
 * @param {Array} messages - Array of message objects {role: 'user'|'assistant', content: string}
 * @returns {Promise<string>}
 */
async function generateResponse(systemPrompt, messages) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Using Claude 3.5 Sonnet as the standard
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return "I'm having a little trouble connecting right now, but I'm here for you. Could you try asking me again in a few minutes?";
  }
}

module.exports = {
  generateResponse
};
