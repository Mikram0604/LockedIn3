const supabase = require('./services/db');
const { sendWhatsAppMessage } = require('./services/twilio');
const intakeAgent = require('./agents/intake');
const walkerAgent = require('./agents/walker');
const knowledgeAgent = require('./agents/knowledge');

async function router(req, res) {
  // Acknowledge Twilio quickly to avoid timeout
  res.status(200).send('OK');

  const { Body, From } = req.body;
  if (!Body || !From) return;

  const phone = From.replace('whatsapp:', '');
  const message = Body.trim();

  try {
    // 1. Check if student exists and their onboarding status
    let { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('phone_number', phone)
      .single();

    if (studentError && studentError.code !== 'PGRST116') {
      console.error('Error fetching student:', studentError);
      return;
    }

    // New student or not fully onboarded -> Route to Intake Agent
    if (!student || !student.onboarding_complete) {
      await intakeAgent.handleMessage(phone, message, student);
      return;
    }

    // 2. Check for active Walker session
    const { data: walkState } = await supabase
      .from('walk_state')
      .select('*')
      .eq('student_id', student.id)
      .eq('is_active', true)
      .single();

    if (walkState) {
      await walkerAgent.handleMessage(phone, message, student, walkState);
      return;
    }

    // 3. Simple Keyword Intent Matching for Walker Agent initiation
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('apply') || lowerMsg.includes('scholarship') || lowerMsg.includes('form') || lowerMsg.includes('help with')) {
      await walkerAgent.startFlow(phone, message, student);
      return;
    }

    // 4. Default fallback -> Route to Knowledge Agent for Q&A
    await knowledgeAgent.handleMessage(phone, message, student);

  } catch (error) {
    console.error('Router error:', error);
    await sendWhatsAppMessage(phone, "I'm having a little trouble right now, but I'll be back soon to help you.");
  }
}

module.exports = { router };
