const { sendWhatsAppMessage } = require('../services/twilio');
const { generateResponse } = require('../services/llm');
const scholarshipsData = require('../data/scholarships.json');

async function handleMessage(phone, message, student) {
  try {
    // Basic RAG implementation: Inject context from json for the demo.
    // In a full implementation, this would query ChromaDB with LlamaIndex.
    
    const context = JSON.stringify(scholarshipsData, null, 2);
    
    const systemPrompt = `You are Disha, an AI-Powered Companion for First-Generation College Students in India.
    Your goal is to answer the student's question accurately based ONLY on the provided context below.
    If the answer cannot be found in the context, do not hallucinate amounts or deadlines. Say you don't know and offer to escalate.
    Be warm, encouraging, and use simple language. Limit responses to 2-3 short paragraphs.
    
    Student Profile: 
    Name: ${student.full_name || 'Student'}
    College: ${student.college_name || 'Unknown'}
    Language: ${student.language_preference || 'English'}
    
    Knowledge Context (Scholarships):
    ${context}
    `;

    const messages = [{ role: 'user', content: message }];
    
    const reply = await generateResponse(systemPrompt, messages);
    await sendWhatsAppMessage(phone, reply);

  } catch (error) {
    console.error('Knowledge Agent Error:', error);
    await sendWhatsAppMessage(phone, "I'm having a little trouble finding the answer right now. Could you try asking me again later?");
  }
}

module.exports = { handleMessage };
