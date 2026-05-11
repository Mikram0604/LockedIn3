const cron = require('node-cron');
const supabase = require('../services/db');
const { sendWhatsAppMessage } = require('../services/twilio');
const { generateResponse } = require('../services/llm');

// Runs daily at 8:00 AM IST (2:30 AM UTC)
cron.schedule('30 2 * * *', async () => {
  console.log('Running daily nudge engine...');
  try {
    // 1. Fetch active students
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('onboarding_complete', true);

    if (error) throw error;

    for (const student of students) {
      // 2. Check conditions (mocking scholarship deadline for demo)
      const needsNudge = student.fee_payment_status === 'Pending' || student.fee_payment_status === 'Partial';
      
      if (needsNudge) {
        // 3. Generate personalized nudge using LLM
        const prompt = `You are Disha, an AI helping first-generation college students.
        Write a short, warm WhatsApp message (max 2 sentences) in ${student.language_preference} to ${student.full_name}.
        Remind them gently that their college fee is currently marked as ${student.fee_payment_status}, and they can ask you for help finding scholarships if they need financial assistance. Do not sound robotic.`;

        const reply = await generateResponse("You are Disha.", [{ role: 'user', content: prompt }]);
        
        // 4. Send message
        await sendWhatsAppMessage(student.phone_number, reply);
        
        // 5. Log nudge
        await supabase.from('nudge_history').insert([{
          student_id: student.id,
          nudge_type: 'fee_reminder',
          content: reply
        }]);
      }
    }
  } catch (error) {
    console.error('Nudge Engine Error:', error);
  }
});

console.log('Nudge Agent initialized.');
