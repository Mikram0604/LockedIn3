import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Bell, Users, ShieldAlert, CheckCircle2, ChevronRight, Activity, Search } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg"><Activity size={24} /></span>
              Disha
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Counselor Dashboard</p>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
              <Users size={20} /> Students
            </Link>
            <Link to="/alerts" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
              <ShieldAlert size={20} /> Alerts
              <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">3</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all w-64" />
              </div>
              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                C
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function DashboardOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          risk_flags (severity)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock data if empty for demo purposes
      if (!data || data.length === 0) {
        setStudents([
          { id: 1, full_name: 'Priya M.', college_name: 'BMS College of Engineering', branch: 'CSE 2nd Year', fee_payment_status: 'Pending', risk_score: 11, status: 'CRITICAL', silent_days: 9 },
          { id: 2, full_name: 'Rahul K.', college_name: 'RV College', branch: 'Mech 1st Year', fee_payment_status: 'Paid', risk_score: 2, status: 'LOW', silent_days: 1 },
          { id: 3, full_name: 'Anjali S.', college_name: 'PES University', branch: 'ECE 3rd Year', fee_payment_status: 'Partial', risk_score: 5, status: 'MEDIUM', silent_days: 4 }
        ]);
      } else {
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }

  const sendCheckIn = async (studentName) => {
    alert(`Check-in message sent to ${studentName} via WhatsApp!`);
    // In a real app, this would call a backend endpoint to trigger Twilio
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="342" icon={<Users className="text-blue-500" />} bg="bg-blue-50" />
        <StatCard title="At-Risk (High/Critical)" value="12" icon={<ShieldAlert className="text-red-500" />} bg="bg-red-50" text="text-red-600" />
        <StatCard title="Active Applications" value="89" icon={<Activity className="text-amber-500" />} bg="bg-amber-50" />
        <StatCard title="Nudges Sent (Today)" value="45" icon={<Bell className="text-indigo-500" />} bg="bg-indigo-50" />
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">At-Risk Watchlist</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">College & Branch</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Silence</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : (
                students.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{student.full_name}</div>
                      <div className="text-xs text-gray-500 mt-1">Fee: {student.fee_payment_status}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{student.college_name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{student.branch}</div>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge status={student.status || 'LOW'} score={student.risk_score} />
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${student.silent_days >= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                        {student.silent_days || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.status === 'CRITICAL' || student.status === 'HIGH' ? (
                        <button 
                          onClick={() => sendCheckIn(student.full_name)}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          Send Check-in
                        </button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Alerts() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 bg-red-50 flex items-center gap-3">
          <ShieldAlert className="text-red-600" />
          <h3 className="text-lg font-bold text-red-900">Critical Alerts Inbox</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">PM</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Priya M.</h4>
                  <p className="text-gray-600 mt-1">Risk Score: 11 (CRITICAL). Student has been silent for 9 days. Fee is marked as unpaid. NSP Scholarship deadline missed.</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">BMS College of Engineering</span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">CSE 2nd Year</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-lg shadow-sm transition-all text-sm">
                  Send Check-in
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all text-sm">
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, text = "text-gray-900" }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className={`text-3xl font-bold ${text}`}>{value}</h4>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        {icon}
      </div>
    </div>
  );
}

function RiskBadge({ status, score }) {
  const styles = {
    LOW: "bg-green-50 text-green-700 border-green-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    CRITICAL: "bg-red-50 text-red-700 border-red-200 font-bold shadow-sm"
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs border flex items-center w-fit gap-1.5 ${styles[status]}`}>
      {status === 'CRITICAL' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>}
      {status} {score ? `(${score})` : ''}
    </span>
  );
}

export default App;
