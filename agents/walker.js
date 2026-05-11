const supabase = require('../services/db');
const { sendWhatsAppMessage } = require('../services/twilio');
const { generateResponse } = require('../services/llm');

const NSP_FLOW = [
  { step: 1, prompt: "Okay, let's apply for the NSP Scholarship. First, do you have your Aadhaar card and a recent passport-size photo ready? (Reply 'Yes' or 'No')" },
  { step: 2, prompt: "Great. Next, do you have a bank account in your own name? (Reply 'Yes' or 'No')" },
  { step: 3, prompt: "Perfect. Now, please visit scholarships.gov.in and click on 'New Registration'. Have you reached the page?" },
  { step: 4, prompt: "Fill in the basic details (Name, DOB, Mobile). When asked for 'Scheme Type', choose 'Post-Matric'. Let me know when you've submitted the first page." },
  { step: 5, prompt: "Awesome. You should have received an Application ID via SMS. Keep that safe! You've completed the first stage. Log in with that ID to upload your documents. Let me know when you are done or if you need help with the documents." }
];

const JAN_DHAN_PIVOT = [
  { step: 1, prompt: "No problem. You'll need a bank account to receive the scholarship. The easiest way is to open a Jan Dhan account at your nearest SBI or Canara Bank branch. You just need your Aadhaar card and 2 photos. It's a zero-balance account. Can you go to the bank tomorrow? (Reply 'Yes' when you have opened the account, or ask me questions if you are confused)." }
];

async function startFlow(phone, message, student) {
  try {
    const { data: walkState, error } = await supabase
      .from('walk_state')
      .insert([{
        student_id: student.id,
        flow_name: 'NSP_Application',
        current_step: 1,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    
    await sendWhatsAppMessage(phone, NSP_FLOW[0].prompt);
  } catch (error) {
    console.error('Error starting flow:', error);
  }
}

async function handleMessage(phone, message, student, walkState) {
  try {
    const msg = message.toLowerCase();
    
    // Check if user wants to pause
    if (msg.includes('later') || msg.includes('pause') || msg.includes('stop')) {
      await sendWhatsAppMessage(phone, "Got it. I've saved your progress. We can continue whenever you're ready. Just message me 'Continue'.");
      return;
    }

    // Handle bank account pivot logic
    if (walkState.flow_name === 'NSP_Application' && walkState.current_step === 2) {
      if (msg === 'no') {
        // Pivot to Jan Dhan
        await supabase
          .from('walk_state')
          .update({
            flow_name: 'Jan_Dhan_Pivot',
            current_step: 1,
            context_data: { return_flow: 'NSP_Application', return_step: 3 }
          })
          .eq('id', walkState.id);
          
        await sendWhatsAppMessage(phone, JAN_DHAN_PIVOT[0].prompt);
        return;
      }
    }

    // Handle return from pivot
    if (walkState.flow_name === 'Jan_Dhan_Pivot') {
      if (msg.includes('yes') || msg.includes('done') || msg.includes('opened')) {
        const returnFlow = walkState.context_data.return_flow;
        const returnStep = walkState.context_data.return_step;
        
        await supabase
          .from('walk_state')
          .update({
            flow_name: returnFlow,
            current_step: returnStep,
            context_data: {}
          })
          .eq('id', walkState.id);
          
        await sendWhatsAppMessage(phone, `Awesome! I'm glad you got the account. Let's resume your NSP application. \n\n${NSP_FLOW[returnStep - 1].prompt}`);
        return;
      } else {
        // If they ask questions about the bank, use LLM
        const prompt = `You are Disha, an AI helping a first-gen Indian student open a Jan Dhan bank account. The student said: "${message}". Give a short, helpful, encouraging answer.`;
        const reply = await generateResponse("You are Disha.", [{ role: "user", content: prompt }]);
        await sendWhatsAppMessage(phone, reply);
        return;
      }
    }

    // Normal flow progression
    let currentFlowDef = walkState.flow_name === 'NSP_Application' ? NSP_FLOW : null;
    
    if (currentFlowDef) {
      const nextStepIndex = walkState.current_step + 1;
      
      if (nextStepIndex > currentFlowDef.length) {
        // Flow completed
        await supabase
          .from('walk_state')
          .update({ is_active: false })
          .eq('id', walkState.id);
          
        await sendWhatsAppMessage(phone, "Congratulations! You've completed the application walk-through. Let me know if you get stuck on anything else.");
      } else {
        await supabase
          .from('walk_state')
          .update({ current_step: nextStepIndex })
          .eq('id', walkState.id);
          
        await sendWhatsAppMessage(phone, currentFlowDef[nextStepIndex - 1].prompt);
      }
    }

  } catch (error) {
    console.error('Walker Agent Error:', error);
    await sendWhatsAppMessage(phone, "I encountered an error. Let's try that step again.");
  }
}

module.exports = { startFlow, handleMessage };
