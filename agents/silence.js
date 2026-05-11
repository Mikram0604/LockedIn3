const cron = require('node-cron');
const supabase = require('../services/db');

// Runs daily at 9:00 AM IST (3:30 AM UTC)
cron.schedule('30 3 * * *', async () => {
  console.log('Running Silence Detector...');
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('onboarding_complete', true);

    if (error) throw error;

    for (const student of students) {
      let riskScore = 0;
      let reasons = [];

      // Demo scoring logic
      
      // 1. Check days since last message (mocking 9 days silent for demo)
      // In reality, calculate from 'conversations' table where direction='inbound'
      const daysSilent = 9; 
      if (daysSilent >= 14) {
        riskScore += 5;
        reasons.push(`${daysSilent} days silent`);
      } else if (daysSilent >= 7) {
        riskScore += 3;
        reasons.push(`${daysSilent} days silent`);
      }

      // 2. Fee status
      if (student.fee_payment_status === 'Pending') {
        riskScore += 3;
        reasons.push('Fee unpaid');
      }

      // 3. Missed deadline (mocking NSP deadline missed)
      riskScore += 2;
      reasons.push('NSP deadline missed');

      // 4. Nudges ignored
      riskScore += 2;
      reasons.push('3 nudges ignored');

      // Evaluate severity
      let severity = 'LOW';
      if (riskScore >= 10) severity = 'CRITICAL';
      else if (riskScore >= 7) severity = 'HIGH';
      else if (riskScore >= 4) severity = 'MEDIUM';

      // Log risk flag if MEDIUM or above
      if (severity !== 'LOW') {
        await supabase.from('risk_flags').insert([{
          student_id: student.id,
          severity: severity,
          reason: reasons.join(', ')
        }]);
        console.log(`Flagged student ${student.full_name} as ${severity}`);
      }
    }
  } catch (error) {
    console.error('Silence Detector Error:', error);
  }
});

console.log('Silence Detector initialized.');
