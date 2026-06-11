import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

// Socket Server URL Connect
const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://YOUR-BACKEND-NAME.onrender.com';
const socket = io.connect(BACKEND_URL);
// ==========================================
// 1. PRODUCTION LEVEL AUTH PAGE (Login/Signup)
// ==========================================
export function Login({ setAuthData }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Email aur password dono zaroori hain! 🔐");
      return;
    }

    const endpoint = isSignUp ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, { 
        email: email.trim(), 
        password: password.trim() 
      });
      
      // Data browser ke local storage me save karo
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userEmail', res.data.email);
      
      // Global App state update karo
      setAuthData({ token: res.data.token, userId: res.data.userId, email: res.data.email });
    } catch (err) {
      alert(err.response?.data?.message || "Incorrect details ya backend server down hai, check kijiye sis!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F2] flex items-center justify-center font-sans px-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center border border-rose-100">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💖</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800">SheShield Safespace</h2>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          {isSignUp ? 'Create a secure account to join our global network' : 'Secure gate for verified member access'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 text-left space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@university.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 bg-slate-50" 
              required 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 bg-slate-50" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-rose-100 mt-2">
            {isSignUp ? 'Create Secure Account 🚀' : 'Secure Login 🔐'}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4">
          {isSignUp ? 'Already have an account?' : 'New to Safespace?'} {' '}
          <span onClick={() => { setIsSignUp(!isSignUp); setEmail(''); setPassword(''); }} className="text-rose-500 font-bold cursor-pointer hover:underline">
            {isSignUp ? 'Login Here' : 'Create Account'}
          </span>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 2. STICKY TOP NAVBAR LAYOUT & PANIC MODE
// ==========================================
export function NavbarLayout({ children, setAuthData }) {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);
  const userEmail = localStorage.getItem('userEmail') || 'Member';

  const confirmLogout = () => {
    localStorage.clear(); 
    setAuthData({ token: null, userId: null, email: null });
    setShowLogoutAlert(false);
  };

  if (isDisguised) {
    return (
      <div className="min-h-screen bg-white p-8 font-serif text-slate-800 flex flex-col items-center justify-center max-w-xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">Chapter 4: Advanced Organic Chemistry</h1>
        <p className="text-sm leading-relaxed text-slate-600 mb-6">
          The reaction rates are calculated using concentration variables mapped over timestamps.
          During a chemical reaction, the rate constant fluctuates based on the thermal threshold...
        </p>
        <button onClick={() => setIsDisguised(false)} className="text-xs bg-slate-100 text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-200 transition">Resume Session</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-rose-500 text-white p-1.5 rounded-lg text-sm">💖</div>
          <span className="font-black text-lg text-slate-800 tracking-tight">Safespace</span>
        </div>
        
        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <Link to="/home" className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-rose-600 transition">🏠 Home</Link>
          <Link to="/groups" className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-rose-600 transition">👥 Groups</Link>
          <Link to="/chat" className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-rose-600 transition">💬 Chat</Link>
          <Link to="/forum" className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-rose-600 transition">📝 Forum</Link>
          <Link to="/docs" className="px-3 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-rose-600 transition">📖 Docs</Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsDisguised(true)} className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-200 transition">🕵️‍♀️ Hide Screen</button>
          <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]" title={userEmail}>{userEmail.split('@')[0]}</span>
          <button onClick={() => setShowLogoutAlert(true)} className="text-xs font-bold text-slate-400 hover:text-rose-600 transition">Logout 🚪</button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto py-8 px-4">{children}</div>

      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-xs w-full text-center shadow-xl border border-slate-100">
            <h4 className="font-black text-slate-800 text-base">Confirm Logout?</h4>
            <p className="text-xs text-slate-400 mt-1">Kya aap session secure log out karna chahti hain?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowLogoutAlert(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded-xl">Cancel</button>
              <button onClick={confirmLogout} className="flex-1 bg-rose-600 text-white text-xs font-bold py-2 rounded-xl">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. HOME DASHBOARD COMPONENT
// ==========================================
export function Home() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-3">
        <Link to="/chat" className="bg-gradient-to-br from-rose-500 to-pink-600 p-5 rounded-2xl text-white shadow-md hover:opacity-95 transition">
          <h3 className="font-bold text-base">Talk Privately 💬</h3>
          <p className="text-rose-100 text-[10px] mt-0.5">Secure, 1-on-1 counseling peer network.</p>
        </Link>
        <Link to="/groups" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-rose-200 transition">
          <h3 className="font-bold text-base text-slate-800">Support Groups 👥</h3>
          <p className="text-slate-400 text-[10px] mt-0.5">Join decentralized dynamic trust circles.</p>
        </Link>
      </div>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-bold text-sm">📣</div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs">Campus Support Forums</h4>
            <p className="text-slate-400 text-[10px]">Anonymously voice safety or health concerns.</p>
          </div>
        </div>
        <Link to="/forum" className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition">Open Forum</Link>
      </div>
    </div>
  );
}

export function Groups() {
  const [dbGroups, setDbGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [showForm, setShowForm] = useState(false);
  const currentUserId = localStorage.getItem('userId') || "6a285fac9b152e7b63e198ae"; // Fallback static ID agar session issue ho

  const fetchGroups = async () => {
    try { 
      const response = await axios.get('http://localhost:5000/api/groups'); 
      setDbGroups(response.data); 
    } catch (error) { 
      console.error("Groups load error:", error); 
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDesc.trim()) {
      alert("Please fill all fields, sis!");
      return;
    }

    try {
      // ✨ ULTIMATE FIX: Direct hit with static fallback check
      const res = await axios.post('http://localhost:5000/api/groups/create-direct', {
        name: groupName.trim(),
        description: groupDesc.trim(),
        userId: currentUserId
      });
      
      if(res.status === 201 || res.status === 200) {
        alert("🔴 Safety Circle Broadcasted Globally! Database Connected.");
        setGroupName(''); 
        setGroupDesc(''); 
        setShowForm(false);
        fetchGroups(); // Screen refresh without reloading webpage
      }
    } catch (error) { 
      console.error("Group launch error details:", error);
      alert("Network Error: Make sure your backend terminal (node index.js) is running on port 5000!");
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black text-slate-800">Sisters' Safety Circles 👥</h2>
          <p className="text-slate-400 text-[11px]">Any logged-in user can spawn custom safety grids.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">{showForm ? 'Close' : '+ Start Circle'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateGroup} className="bg-white p-4 rounded-2xl border border-rose-100 space-y-3 animate-fadeIn">
          <input type="text" placeholder="Group Name (e.g., Late Transit Group Metro Line 3)" value={groupName} onChange={(e)=>setGroupName(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 bg-slate-50" required />
          <input type="text" placeholder="Target Objective Description..." value={groupDesc} onChange={(e)=>setGroupDesc(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 bg-slate-50" required />
          <button type="submit" className="w-full bg-rose-600 text-white font-bold text-xs py-2 rounded-xl shadow-md hover:bg-rose-700 transition">Launch Circle 🚀</button>
        </form>
      )}

      <div className="space-y-2">
        {dbGroups.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-xl border border-slate-100 text-slate-400 text-xs">No active safety rooms right now. Create one!</div>
        ) : (
          dbGroups.map((g, index) => (
            <div key={g._id || g.id || index} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm animate-fadeIn">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {g.name}
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-tight">{g.description}</p>
              </div>
              <button onClick={() => alert(`Entering live communication stream for: ${g.name}`)} className="bg-rose-50 text-rose-600 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-500 hover:text-white transition">Join</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. LIVE SOCKET CHAT COMPONENT
// ==========================================
export function Chat() {
  const [messages, setMessages] = useState([{ text: "Welcome to SheShield encrypted pipeline. Start texting safely.", isMe: false }]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { text: data.text, isMe: false }]);
    });
    return () => socket.off("receive_message");
  }, []);

  const sendMsg = () => {
    if (!input.trim()) return;
    socket.emit("send_message", { text: input });
    setMessages([...messages, { text: input, isMe: true }]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-[380px] flex flex-col overflow-hidden animate-fadeIn">
      <div className="bg-rose-500 p-3 text-white font-bold text-xs flex justify-between items-center">
        <span>💬 Dynamic Multi-User Live Grid</span>
        <span className="text-[9px] bg-green-400 text-green-950 font-black px-2 py-0.5 rounded-full animate-pulse">● LIVE SECURE</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2.5 rounded-xl text-xs max-w-xs ${m.isMe ? 'bg-rose-500 text-white rounded-br-none' : 'bg-slate-100 text-slate-700 rounded-bl-none'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-slate-100 flex gap-2">
        <input type="text" placeholder="Say something supportive..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&sendMsg()} className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl outline-none text-slate-700 bg-slate-50" />
        <button onClick={sendMsg} className="bg-rose-600 text-white text-xs px-4 rounded-xl font-bold hover:bg-rose-700 transition">Send</button>
      </div>
    </div>
  );
}

// ==========================================
// 6. FORUM COMPONENT (Direct Insertion Sync)
// ==========================================
export function Forum() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Periods & Puberty 🩸');
  const currentUserId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    try { 
      const response = await axios.get('http://localhost:5000/api/posts'); 
      setPosts(response.data); 
    } catch (error) { 
      console.error("Posts fetch error:", error); 
    }
  };
  
  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    try {
      // ✨ FIX: End-point matches exactly to '/api/posts/create-direct'
      await axios.post('http://localhost:5000/api/posts/create-direct', { 
        userId: currentUserId || "GlobalUser", 
        content: `[${selectedTag}] ${content.trim()}` 
      });
      setContent(''); setIsModalOpen(false); 
      fetchPosts(); // Refresh matching stream layout
    } catch (error) { 
      console.error("Forum post creation error:", error); 
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-black text-slate-800">Support Discussions</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md hover:bg-rose-600 transition">+ Create Post</button>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-xl border border-slate-100 text-slate-400 text-xs">No entries published yet.</div>
        ) : (
          posts.map((p) => (
            <div key={p._id || p.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-fadeIn">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Anonymous Broadcast</span>
                <span className="text-[9px] text-slate-400">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">{p.content}</p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 font-bold">✕</button>
            <h3 className="text-sm font-black text-slate-800 mb-2">Create a Post</h3>
            <textarea placeholder="Share your experience anonymously..." value={content} onChange={(e)=>setContent(e.target.value)} className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs outline-none resize-none mb-3 text-slate-700 bg-slate-50" />
            <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
              {['Periods & Puberty 🩸', 'Mental Support 🧠', 'School Pressure 📚'].map((t) => (
                <button key={t} onClick={() => setSelectedTag(t)} className={`text-[9px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap transition ${selectedTag === t ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
              ))}
            </div>
            <button onClick={handleCreatePost} className="w-full bg-rose-500 text-white font-bold text-xs py-2 rounded-xl shadow-md hover:bg-rose-600 transition">Post Anonymously</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Docs() {
  const helplines = [
    { name: "National Women Helpline", number: "1091", desc: "24/7 Toll-Free emergency response grid." },
    { name: "Student Anti-Ragging Cell", number: "1800-180-5522", desc: "Direct UGC campus protection cell." },
    { name: "Domestic Abuse Helpline", number: "181", desc: "Immediate legal & mental counseling support." },
    { name: "Local Campus Security (Internal)", number: "9999-XXXXXX", desc: "Emergency quick-response guards." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-950 p-5 rounded-2xl text-white shadow-md">
        <h3 className="font-black text-base flex items-center gap-2">📖 Safety Resources & Legal Docs</h3>
        <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
          Verified constitutional rights, immediate situational workflows, and zero-compromise institutional hotlines.
        </p>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-rose-600 uppercase tracking-wider">🚨 Instant Panic Hotlines</h4>
        <div className="grid gap-2">
          {helplines.map((h, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <h5 className="text-xs font-bold text-slate-800">{h.name}</h5>
                <p className="text-slate-400 text-[10px] mt-0.5">{h.desc}</p>
              </div>
              <a href={`tel:${h.number}`} className="bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-black text-xs px-3 py-1.5 rounded-xl border border-rose-100 transition tracking-wide">
                📞 {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Know-Your-Rights Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3 shadow-sm">
        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">🛡️ Your Legal Shield (POSH Act)</h4>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Under the **Prevention of Sexual Harassment (POSH) Act**, every college/university must operate an **Internal Complaints Committee (ICC)**. You have the right to file an anonymous structural query through our Forum tab to alert peers without disclosing your identity.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// MAIN ROUTER MASTER CONTROLLER (Default Export)
// ==========================================
function App() {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail')
  });

  const isAuthenticated = !!authData.token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login setAuthData={setAuthData} />} />
        <Route path="/home" element={isAuthenticated ? <NavbarLayout setAuthData={setAuthData}><Home /></NavbarLayout> : <Navigate to="/" />} />
        <Route path="/groups" element={isAuthenticated ? <NavbarLayout setAuthData={setAuthData}><Groups /></NavbarLayout> : <Navigate to="/" />} />
        <Route path="/chat" element={isAuthenticated ? <NavbarLayout setAuthData={setAuthData}><Chat /></NavbarLayout> : <Navigate to="/" />} />
        <Route path="/forum" element={isAuthenticated ? <NavbarLayout setAuthData={setAuthData}><Forum /></NavbarLayout> : <Navigate to="/" />} />
        <Route path="/docs" element={isAuthenticated ? <NavbarLayout setAuthData={setAuthData}><Docs /></NavbarLayout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;