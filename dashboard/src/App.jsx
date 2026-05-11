import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bell, Users, ShieldAlert, Activity, Search, Send, MessageCircle, ChevronRight, Phone, MoreVertical, Check, CheckCheck, Sparkles, TrendingUp } from 'lucide-react';

const API_URL = 'https://lockedin3-production.up.railway.app';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10 -ml-64 -mb-64"></div>
          
          <Routes>
            <Route path="/" element={<><Header title="Student Analytics" /><div className="flex-1 overflow-auto p-8"><DashboardOverview /></div></>} />
            <Route path="/alerts" element={<><Header title="Priority Alerts" /><div className="flex-1 overflow-auto p-8"><Alerts /></div></>} />
            <Route path="/chat" element={<WhatsAppChat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col z-20">
      <div className="p-8">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <span className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200"><Sparkles size={24} fill="white" /></span>
          Disha
        </h1>
        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">Empowering Aspirations</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <SidebarLink to="/" icon={<Users size={20} />} label="Student Registry" active={isActive('/')} />
        <SidebarLink to="/alerts" icon={<ShieldAlert size={20} />} label="Critical Alerts" active={isActive('/alerts')} badge="1" badgeColor="bg-red-500" />
        <SidebarLink to="/chat" icon={<MessageCircle size={20} />} label="Live Companion" active={isActive('/chat')} badge="Active" badgeColor="bg-emerald-500" />
      </nav>

      <div className="p-6 m-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Hackathon Live</p>
        <p className="text-xs mt-2 text-slate-300 leading-relaxed">System is now connected to your personal WhatsApp.</p>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          RELIABILITY: 99.9%
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label, active, badge, badgeColor }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon}
      {label}
      {badge && <span className={`ml-auto ${badgeColor} text-white py-0.5 px-2.5 rounded-full text-[10px] font-black uppercase tracking-tighter`}>{badge}</span>}
    </Link>
  );
}

function Header({ title }) {
  return (
    <header className="h-20 bg-white/40 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-10">
      <div className="flex items-center gap-4">
        <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" size={18} />
          <input type="text" placeholder="Search index..." className="pl-12 pr-6 py-2.5 bg-slate-100/50 border border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all w-72 font-medium" />
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2.5 text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 border-2 border-white rounded-full animate-ping"></span></button>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px] cursor-pointer hover:rotate-3 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-indigo-600 text-xs shadow-inner">MI</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function WhatsAppChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const phone = '+919999999999';

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, phone })
      });
      const data = await res.json();
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
      }, 800);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: "Connection error. Make sure the backend server is running.", sender: 'bot', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative">
      {/* WhatsApp Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4 z-10 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-100">D</div>
        <div className="flex-1">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">Disha <span className="text-slate-300 font-normal">|</span> <span className="font-medium text-slate-400">Companion</span></h3>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {isTyping ? 'generating response...' : 'active now'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Phone size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-10 space-y-6" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-indigo-100 flex items-center justify-center mb-6 rotate-3">
              <span className="text-indigo-600 text-4xl font-black">D</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Personalized Student Companion</h3>
            <p className="text-slate-500 mt-3 max-w-sm font-medium leading-relaxed">Experience how Disha guides students through scholarships and financial hurdles in real-time.</p>
            <div className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 animate-bounce">Send "Hi" to Begin</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[70%] px-5 py-4 rounded-3xl shadow-xl shadow-slate-200/50 text-sm leading-relaxed whitespace-pre-wrap font-medium ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white text-slate-700 rounded-tl-sm'
            }`}>
              {msg.text}
              <div className={`flex items-center gap-2 mt-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <span className={`text-[9px] font-black uppercase tracking-tighter opacity-60`}>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck size={14} className="text-indigo-200" />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white px-6 py-5 rounded-3xl rounded-tl-sm shadow-xl shadow-slate-200/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Inquire about scholarships, deadlines, or fees..."
              className="w-full pl-6 pr-14 py-4 rounded-2xl bg-slate-100 border-2 border-transparent outline-none text-sm font-bold transition-all focus:bg-white focus:border-indigo-600 focus:shadow-2xl focus:shadow-indigo-100"
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Send size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/students`).then(r => r.json()).then(data => { setStudents(data); setLoading(false); }).catch(() => {
      setStudents([
        { id: 1, full_name: 'Priya M.', college_name: 'BMS College of Engineering', branch: 'CSE 2nd Year', fee_payment_status: 'Pending', risk_score: 11, status: 'CRITICAL', silent_days: 9 },
        { id: 2, full_name: 'Rahul K.', college_name: 'RV College', branch: 'Mech 1st Year', fee_payment_status: 'Paid', risk_score: 2, status: 'LOW', silent_days: 1 },
        { id: 3, full_name: 'Anjali S.', college_name: 'PES University', branch: 'ECE 3rd Year', fee_payment_status: 'Partial', risk_score: 5, status: 'MEDIUM', silent_days: 4 }
      ]);
      setLoading(false);
    });
  }, []);

  const sendCheckIn = (name) => {
    fetch(`${API_URL}/api/checkin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentName: name }) })
      .then(() => alert(`✅ Priority Check-in message sent to ${name} via WhatsApp!`));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Monitored Students" value="342" icon={<Users size={24} />} gradient="from-indigo-600 to-indigo-700" />
        <StatCard title="Critical Interventions" value="12" icon={<ShieldAlert size={24} />} gradient="from-rose-500 to-rose-600" />
        <StatCard title="Scholarship Progress" value="89" icon={<TrendingUp size={24} />} gradient="from-emerald-500 to-emerald-600" />
        <StatCard title="Support Notifications" value="45" icon={<Bell size={24} />} gradient="from-amber-500 to-amber-600" />
      </div>
      
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-white to-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">At-Risk Watchlist</h3>
            <p className="text-sm text-slate-400 mt-1 font-medium">Prioritizing students requiring immediate support.</p>
          </div>
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm">Export Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-black border-b border-slate-100">
                <th className="px-10 py-6">Student Information</th>
                <th className="px-10 py-6">Institution Detail</th>
                <th className="px-10 py-6">Priority Level</th>
                <th className="px-10 py-6">Inactivity</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Synchronizing Registry...</td></tr>
              ) : (
                students.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0)).map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-6">
                      <div className="font-black text-slate-800 text-base">{s.full_name}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`w-2 h-2 rounded-full ${s.fee_payment_status === 'Pending' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">Fees: {s.fee_payment_status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="font-bold text-slate-600">{s.college_name}</div>
                      <div className="text-[11px] font-black text-indigo-400 uppercase tracking-tight mt-1">{s.branch}</div>
                    </td>
                    <td className="px-10 py-6"><RiskBadge status={s.status} score={s.risk_score} /></td>
                    <td className="px-10 py-6">
                      <div className={`font-black text-lg ${s.silent_days >= 7 ? 'text-rose-600' : 'text-slate-600'}`}>
                        {s.silent_days} <span className="text-[10px] uppercase text-slate-400 ml-1">Days</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {(s.status === 'CRITICAL' || s.status === 'HIGH') ? (
                        <button onClick={() => sendCheckIn(s.full_name)} className="px-6 py-2.5 bg-rose-600 text-white hover:bg-rose-700 font-black rounded-xl transition-all shadow-lg shadow-rose-100 text-xs uppercase tracking-wider">Intervene</button>
                      ) : (
                        <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><ChevronRight size={20} /></button>
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
  const sendCheckIn = () => alert('✅ Priority Intervention sent to Priya M.');
  const markResolved = () => alert('✅ Alert marked as resolved.');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-[2.5rem] border border-rose-100 shadow-2xl shadow-rose-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="px-10 py-8 border-b border-rose-50 bg-rose-50/30 flex items-center gap-4">
          <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-200">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-950 tracking-tight">Active Interventions</h3>
            <p className="text-sm text-rose-600/60 font-bold uppercase tracking-widest mt-1">Immediate Action Required</p>
          </div>
        </div>
        <div className="p-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex gap-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-rose-200">
                <span className="text-white font-black text-2xl tracking-tighter">PM</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-black text-slate-800 text-2xl tracking-tight">Priya M.</h4>
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Critical</span>
                </div>
                <p className="text-slate-600 mt-4 font-medium leading-relaxed text-lg">
                  Student has been unresponsive for <span className="text-rose-600 font-black">9 days</span>. 
                  Financial flags detected: <span className="italic font-bold">Unpaid college fees</span> and <span className="italic font-bold">missed NSP deadline</span>.
                </p>
                <div className="flex gap-3 mt-6 flex-wrap">
                  <Tag label="BMS College" />
                  <Tag label="CSE 2nd Year" />
                  <Tag label="Bidar District" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button onClick={sendCheckIn} className="px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 font-black rounded-2xl shadow-xl shadow-slate-200 transition-all text-sm uppercase tracking-widest">Send Priority Nudge</button>
              <button onClick={markResolved} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-900 font-black rounded-2xl transition-all text-sm uppercase tracking-widest text-center">Resolve Case</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }) {
  return <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl">{label}</span>;
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150`}></div>
      <div className="relative flex flex-col gap-4">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${gradient} text-white w-fit shadow-lg transition-transform group-hover:scale-110`}>{icon}</div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h4 className="text-4xl font-black text-slate-800 tracking-tighter">{value}</h4>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ status, score }) {
  const styles = { 
    LOW: "bg-emerald-50 text-emerald-700 border-emerald-100", 
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100", 
    HIGH: "bg-orange-50 text-orange-700 border-orange-100", 
    CRITICAL: "bg-rose-50 text-rose-700 border-rose-100 font-black shadow-sm" 
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center w-fit gap-2 ${styles[status]}`}>
      {status === 'CRITICAL' && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>}
      {status} {score ? <span className="opacity-40">/ {score}</span> : ''}
    </span>
  );
}

export default App;
