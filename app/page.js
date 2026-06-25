"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MarkdownMessage({ content, isUser }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          if (inline) {
            return <code className={`text-xs rounded px-1 py-0.5 ${isUser ? "bg-white/20" : "bg-black/10"}`}>{children}</code>;
          }
          if (match) {
            return (
              <div className="my-2 rounded-lg overflow-hidden border border-gray-700">
                <div className="text-[10px] px-3 py-1 bg-gray-900 text-gray-400 font-mono border-b border-gray-700">{match[1]}</div>
                <SyntaxHighlighter language={match[1]} style={oneDark} customStyle={{ margin: 0, fontSize: "0.75rem", borderRadius: 0 }} PreTag="div">
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <pre className={`text-xs rounded-lg p-3 my-2 overflow-x-auto ${isUser ? "bg-white/20" : "bg-gray-900"}`}>
              <code>{children}</code>
            </pre>
          );
        },
        ul: ({ children }) => <ul className="list-disc ml-4 mb-1 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-4 mb-1 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">
            {children}
          </a>
        ),
        h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className={`border-l-2 pl-3 my-1 opacity-80 ${isUser ? "border-white/40" : "border-gray-300"}`}>{children}</blockquote>
        ),
        hr: () => <hr className="my-2 border-t border-gray-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

const PROFESSORS = [
  { id: "software", name: "Shulian", subject: "Programación", style: "inteligente, serio, brainrot. JavaScript, TypeScript, HTML y CSS", avatar: "/avatares/avatar_shuli.PNG", pfp: "/pfp/pfp_shuli.png" },
  { id: "hardware", name: "Darío", subject: "Hardware", style: "un poco viejo, inteligente, muy argentino. Componentes PC, sistemas numéricos, circuitos eléctricos y Arduino", avatar: "/avatares/avatar_daro.PNG", pfp: "/pfp/pfp_daro.png" },
  { id: "timi", name: "Pau", subject: "TIMI", style: "buena onda, tranquila. Figma y Tinkercad", avatar: "/avatares/avatar_pau.PNG", pfp: "/pfp/pfp_pau.png" },
  { id: "redes", name: "Ivo", subject: "Redes", style: "gracioso, explica con historias, amigable. Redes informáticas, ciberseguridad, modelo OSI", avatar: "/avatares/avatar_ivo.PNG", pfp: "/pfp/pfp_ivo.png" },
];

function TabIcon({ id }) {
  const icons = {
    content: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    context: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    quiz: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    chat: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    results: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    juegos: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    reels: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  };
  return icons[id] || null;
}

export default function Home() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState({ name: "", role: "" });

  if (view === "login") {
    return <Login onLogin={(name, r, lvl) => { setUser({ name, role: r, level: lvl || null }); setView(r === "teacher" ? "teacher-dashboard" : "student-dashboard"); }} />;
  }
  if (user.role === "teacher") return <TeacherDashboard user={user} onLogout={() => setView("login")} />;
  return <StudentDashboard user={user} onLogout={() => setView("login")} />;
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [code, setCode] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      if (!code.trim()) { setError("Ingresa el código de registro"); return; }
      setRegistering(true);
      try {
        const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "register", username: name, password, role, code }) });
        const data = await res.json();
        if (data.ok) { setIsRegister(false); setCode(""); setError(""); alert("Registro exitoso. Ahora inicia sesión."); }
        else setError(data.error || "Error al registrarse");
      } catch { setError("Error de conexión"); }
      setRegistering(false);
    } else {
      try {
        const res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", username: name, password, role }) });
        const data = await res.json();
        if (data.ok) onLogin(name, data.role, data.level);
        else setError(data.error || "Credenciales incorrectas");
      } catch { setError("Error de conexión"); }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C043F] to-[#e71367] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#e71367] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0C043F] rounded-full blur-3xl" />
      </div>
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4">
            <img src="/logo/images.png" alt="EduQuiz AI" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-black">TicQuiz IA</h1>
          <p className="text-gray-500 mt-1">Plataforma Educativa con Inteligencia Artificial</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button type="button" onClick={() => setRole("student")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "student" ? "bg-white shadow text-[#0C043F]" : "text-gray-500 hover:text-gray-700"}`}>
              <span className="block text-lg mb-0.5">🎓</span> Alumno
            </button>
            <button type="button" onClick={() => setRole("teacher")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "teacher" ? "bg-white shadow text-[#0C043F]" : "text-gray-500 hover:text-gray-700"}`}>
              <span className="block text-lg mb-0.5">👨‍🏫</span> Docente
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder={role === "teacher" ? "docente" : "alumno"} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="••••••" required />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de registro</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder={role === "teacher" ? "Código de docente" : "Código de alumno"} />
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button type="submit" disabled={registering} className="w-full bg-[#0C043F] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0C043F]/90 transition shadow-lg disabled:opacity-50">
            {registering ? "Registrando..." : isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => { setIsRegister(!isRegister); setError(""); setCode(""); }} className="text-sm text-[#0C043F] hover:text-[#0C043F] transition">
            {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
          <p><strong>Demo:</strong> <span className="font-mono">docente</span> / <span className="font-mono">docente123</span> <span className="mx-1">|</span> <span className="font-mono">alumno</span> / <span className="font-mono">alumno123</span></p>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 p-3 gap-1">
      <div className="px-3 py-4 mb-2 flex items-center gap-3">
        <img src="/logo/images.png" alt="TicQuiz IA" className="w-9 h-9 object-contain" />
        <p className="text-sm font-bold text-gray-800">TicQuiz IA</p>
      </div>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-[#e71367]/10 text-[#0C043F]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
          <TabIcon id={tab.id} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function MobileNav({ tabs, activeTab, onTabChange }) {
  return (
    <div className="md:hidden flex gap-1 mb-4 bg-white rounded-xl shadow p-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${activeTab === tab.id ? "bg-[#0C043F] text-white" : "text-gray-500 hover:text-[#0C043F]"}`}>
          <TabIcon id={tab.id} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function DashboardHeader({ title, userName, onLogout, notifCount, onNotifClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo/images.png" alt="TicQuiz IA" className="w-8 h-8 object-contain" />
          <div>
            <span className="text-sm md:text-lg font-bold text-gray-800">TicQuiz IA</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-2">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {notifCount > 0 && (
              <button onClick={onNotifClick} className="relative mr-1" title="Nuevas tareas">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
              </button>
            )}
            <div className="w-8 h-8 bg-[#0C043F]/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-[#0C043F]">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">{userName}</span>
          </div>
          <button onClick={onLogout} className="text-sm text-gray-400 hover:text-red-500 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function TeacherDashboard({ user, onLogout }) {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState(PROFESSORS[0].id);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessagesByProf, setChatMessagesByProf] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState([]);
  const [savedContentList, setSavedContentList] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [publishedQuizzes, setPublishedQuizzes] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [deadline, setDeadline] = useState("");
  const [quizLevel, setQuizLevel] = useState("3ro");
  const [quizSubject, setQuizSubject] = useState("Hardware");
  const [contextText, setContextText] = useState("");
  const [contextUrl, setContextUrl] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [teacherNotifs, setTeacherNotifs] = useState(0);
  const [teacherNotifList, setTeacherNotifList] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessagesByProf[selectedProfessor]]);

  const loadTeacherNotifs = useCallback(async () => {
    try { const res = await fetch(`/api/notifications?userName=${user.name}&role=teacher`); const data = await res.json(); setTeacherNotifs(data.length); setTeacherNotifList(data); } catch {}
  }, [user.name]);

  const checkMissed = useCallback(async () => {
    try { await fetch("/api/check-missed"); loadTeacherNotifs(); } catch {}
  }, [loadTeacherNotifs]);

  const markTeacherNotifRead = useCallback(async () => {
    try { for (const n of teacherNotifList) { await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notifId: n.id, userName: user.name }) }); } setTeacherNotifs(0); setTeacherNotifList([]); } catch {}
  }, [user.name, teacherNotifList]);

  const loadResults = useCallback(async () => {
    try { const res = await fetch("/api/results"); const data = await res.json(); setResults(data); } catch {}
  }, []);

  const loadQuizzes = useCallback(async () => {
    try { const res = await fetch("/api/quizzes"); const data = await res.json(); setPublishedQuizzes(data); } catch {}
  }, []);

  const loadContext = useCallback(async () => {
    try { const res = await fetch("/api/context"); const data = await res.json(); setContextText(data.text || ""); } catch {}
  }, []);

  useEffect(() => { loadTeacherNotifs(); if (activeTab === "results") { loadResults(); checkMissed(); } if (activeTab === "quiz") loadQuizzes(); if (activeTab === "context") loadContext(); }, [activeTab, loadResults, loadQuizzes, loadContext, loadTeacherNotifs, checkMissed]);

  const saveContext = async () => {
    try { await fetch("/api/context", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: contextText }) }); alert("Contexto guardado. Los chatbots ahora usarán este material."); } catch { alert("Error al guardar el contexto"); }
  };

  const addContentToContext = (item) => {
    setContextText((prev) => (prev ? prev + "\n\n---\n\n" : "") + `[${item.topic}]\n${item.content}`);
  };

  const fetchUrl = async () => {
    if (!contextUrl.trim()) return;
    setFetchingUrl(true);
    try {
      const res = await fetch("/api/fetch-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: contextUrl }) });
      const data = await res.json();
      if (data.text) setContextText((prev) => (prev ? prev + "\n\n---\n\n" : "") + data.text);
      else alert("Error: " + (data.error || "respuesta inesperada"));
    } catch (e) { alert("Error: " + e.message); }
    setFetchingUrl(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setFileName(file.name); setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(",")[1];
        const res = await fetch("/api/extract-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, data: base64 }) });
        const result = await res.json();
        if (result.text) setContent(result.text); else alert("Error: " + (result.error || "respuesta inesperada"));
        setUploading(false);
      };
      reader.onerror = () => { alert("Error al leer el archivo"); setUploading(false); };
      reader.readAsDataURL(file);
    } catch (e) { alert("Error al procesar el archivo: " + e.message); setUploading(false); }
  };

  const saveContent = () => {
    if (!topic.trim() || !content.trim()) return;
    setSavedContentList([...savedContentList, { id: Date.now(), topic, content, date: new Date().toLocaleString() }]);
    alert(`Contenido "${topic}" guardado correctamente.`);
  };

  const generateQuiz = async () => {
    const selectedContent = selectedContentIds.length > 0 ? savedContentList.filter((c) => selectedContentIds.includes(c.id)).map((c) => c.content).join("\n\n---\n\n") : content;
    const selectedTopic = selectedContentIds.length > 0 ? savedContentList.filter((c) => selectedContentIds.includes(c.id)).map((c) => c.topic).join(" + ") : topic;
    if (!selectedContent.trim() || !selectedTopic.trim()) return;
    setLoading(true); setQuiz(null);
    try {
      const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: selectedContent, topic: selectedTopic, count: questionCount }) });
      const data = await res.json(); setQuiz(data);
    } catch (e) { alert("Error al generar el quiz: " + e.message); }
    setLoading(false);
  };

  const publishQuiz = async () => {
    if (!quiz || quiz.error) return; setPublishing(true);
    try {
      const qTopic = selectedContentIds.length > 0 ? savedContentList.filter((c) => selectedContentIds.includes(c.id)).map((c) => c.topic).join(" + ") : topic;
      const res = await fetch("/api/quizzes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: qTopic, questions: quiz, deadline: deadline || null, level: quizLevel, subject: quizSubject }) });
      if (deadline) {
        const published = await res.json();
        await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quizId: published.id, topic: qTopic, deadline, publishedAt: published.publishedAt }) });
      }
      setQuiz(null); loadQuizzes(); setDeadline(""); setQuizLevel("3ro"); setQuizSubject("Hardware"); alert("Quiz publicado. Los alumnos ya pueden verlo.");
    } catch { alert("Error al publicar el quiz"); }
    setPublishing(false);
  };

  const chatMessages = chatMessagesByProf[selectedProfessor] || [];

  const saveChatHistory = async (profId, msgs) => {
    try { await fetch("/api/chat-history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userName: user.name, professorId: profId, messages: msgs }) }); } catch {}
  };

  useEffect(() => {
    if (activeTab === "chat") {
      (async () => {
        try { const res = await fetch(`/api/chat-history?userName=${user.name}&professorId=${selectedProfessor}`); const data = await res.json(); if (data.messages && data.messages.length > 0) setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: data.messages })); } catch {}
      })();
    }
  }, [activeTab, selectedProfessor, user.name]);

  const sendChatMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim()) return;
    const current = chatMessagesByProf[selectedProfessor] || [];
    const newMessages = [...current, { role: "user", content: chatInput }];
    setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: newMessages }));
    setChatInput("");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages, expert: selectedProfessor }) });
      const data = await res.json();
      const withReply = [...newMessages, { role: "assistant", content: data.text || data.error || "Error desconocido" }];
      setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: withReply }));
      saveChatHistory(selectedProfessor, withReply);
    } catch {
      const withError = [...newMessages, { role: "assistant", content: "Error al conectar con el chatbot." }];
      setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: withError }));
    }
  };

  const tabs = [
    { id: "content", label: "Subir Contenido" },
    { id: "context", label: "Contexto" },
    { id: "quiz", label: "Generar Quiz" },
    { id: "chat", label: "Chatbot" },
    { id: "results", label: "Resultados" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader title="Panel Docente" userName={user.name} onLogout={onLogout} notifCount={teacherNotifs} onNotifClick={() => { markTeacherNotifRead(); setActiveTab("results"); }} />
        <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
          <MobileNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "content" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="content" /> Subir Contenido Educativo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Tema / Título</label>
                  <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ej: Introducción a Python" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Archivo (.txt, .pdf, .png, .jpg)</label>
                  <div className="flex gap-2 items-center">
                    <input ref={fileInputRef} type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.gif,.bmp,.webp" onChange={handleFileUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="border border-gray-200 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Seleccionar archivo
                    </button>
                    {fileName && <span className="text-sm text-gray-500 truncate max-w-[200px]">{fileName}</span>}
                    {uploading && <span className="text-sm text-[#e71367] animate-pulse">Procesando...</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" placeholder="Escribe, pega o sube un archivo (.txt, .pdf, imagen) con el contenido educativo..." />
                </div>
                <button onClick={saveContent} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-sm">Guardar Contenido</button>
                {savedContentList.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600 mb-2">Contenidos guardados:</p>
                    {savedContentList.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1.5 text-sm border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{item.topic}</span>
                        <span className="text-gray-400 text-xs">{item.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "context" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="context" /> Contexto para Chatbots</h2>
                <p className="text-sm text-gray-500 mb-4">El contenido que agregues aquí será usado por todos los chatbots para responder con conocimiento del curso.</p>

                {savedContentList.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600 mb-2">Agregar contenido guardado:</p>
                    {savedContentList.map((item) => (
                      <button key={item.id} onClick={() => addContentToContext(item)} className="w-full text-left flex justify-between items-center py-1.5 px-2 text-sm hover:bg-[#e71367]/10 rounded-lg transition border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{item.topic}</span>
                        <span className="text-xs text-[#e71367] hover:text-[#0C043F]">+ Agregar</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Importar desde URL (Google Docs, páginas web)</label>
                  <div className="flex gap-2">
                    <input type="url" value={contextUrl} onChange={(e) => setContextUrl(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://docs.google.com/document/d/..." />
                    <button onClick={fetchUrl} disabled={fetchingUrl || !contextUrl.trim()} className="bg-[#0C043F] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#0C043F]/90 disabled:opacity-50 transition text-sm whitespace-nowrap">{fetchingUrl ? "Importando..." : "Importar"}</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido de contexto (editable)</label>
                  <textarea value={contextText} onChange={(e) => setContextText(e.target.value)} rows={12} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y font-mono text-sm" placeholder="Agrega aquí el material del curso que los chatbots deben conocer. Puedes pegar texto, importar desde URL o agregar contenido guardado." />
                </div>

                <button onClick={saveContext} className="mt-4 bg-gradient-to-r from-[#0C043F] to-[#e71367] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#0C043F]/90 hover:to-[#e71367]/90 transition shadow-sm">Guardar Contexto</button>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="quiz" /> Generar Quiz con IA</h2>
                {savedContentList.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-600 mb-2">Seleccionar contenido guardado:</p>
                    {savedContentList.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 py-1.5 text-sm cursor-pointer hover:text-[#0C043F]">
                        <input type="checkbox" checked={selectedContentIds.includes(item.id)} onChange={() => setSelectedContentIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} className="rounded" />
                        <span>{item.topic}</span>
                        <span className="text-gray-400 text-xs ml-auto">{item.date}</span>
                      </label>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tema (manual)</label>
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder={selectedContentIds.length > 0 ? "O usa el tema de los contenidos seleccionados" : "Ej: Introducción a Python"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido (manual)</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" placeholder={selectedContentIds.length > 0 ? "O escribe contenido adicional aquí..." : "Escribe contenido aquí..."} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Cantidad de preguntas</label>
                    <input type="number" value={questionCount} onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 5))} min={1} max={20} className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                  </div>
                </div>
                <button onClick={generateQuiz} disabled={loading} className="mt-4 bg-gradient-to-r from-[#0C043F] to-[#e71367] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#0C043F]/90 hover:to-[#e71367]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">{loading ? "Generando..." : "Generar Quiz"}</button>
              </div>

              {quiz && !quiz.error && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><TabIcon id="quiz" /> Quiz Generado</h3>
                  <QuizView questions={quiz} />
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">Curso</label>
                      <select value={quizLevel} onChange={(e) => setQuizLevel(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                        <option value="3ro">3ro</option>
                        <option value="4to">4to</option>
                        <option value="5to">5to</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">Materia</label>
                      <select value={quizSubject} onChange={(e) => setQuizSubject(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Redes">Redes</option>
                        <option value="TIMI">TIMI</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Fecha límite (opcional)</label>
                    <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                  </div>
                  <button onClick={publishQuiz} disabled={publishing} className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition shadow-sm">{publishing ? "Publicando..." : "Publicar Quiz para Alumnos"}</button>
                </div>
              )}

              {quiz?.error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{quiz.error}</div>}

              {publishedQuizzes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quizzes Publicados</h3>
                  <div className="space-y-2">
                    {publishedQuizzes.map((q) => (
                      <div key={q.id} className="flex justify-between items-center p-3 bg-green-50 rounded-xl text-sm border border-green-100">
                        <div>
                          <span className="font-medium text-gray-700">{q.topic}</span>
                          {q.level && <span className="ml-2 text-xs bg-[#0C043F]/10 text-[#0C043F] px-2 py-0.5 rounded-full font-medium">{q.level}</span>}
                          {q.subject && <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{q.subject}</span>}
                          {q.deadline && (
                            <span className={`ml-2 text-xs ${new Date(q.deadline) > new Date() ? "text-orange-500" : "text-red-500"}`}>
                              {new Date(q.deadline) > new Date() ? "⌛ " + new Date(q.deadline).toLocaleString() : "⛔ Vencido"}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(q.publishedAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.pfp} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{PROFESSORS.find((p) => p.id === selectedProfessor)?.name}</h2>
                    <p className="text-xs text-gray-400">{PROFESSORS.find((p) => p.id === selectedProfessor)?.subject}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {PROFESSORS.map((p) => {
                    const profMsgs = chatMessagesByProf[p.id] || [];
                    return (
                      <button key={p.id} onClick={() => setSelectedProfessor(p.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${selectedProfessor === p.id ? "bg-[#0C043F] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        <span className={`w-2 h-2 rounded-full ${profMsgs.length > 0 ? "bg-green-400" : "bg-gray-300"}`} />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatBottomRef}>
                {chatMessages.length === 0 && (
                  <div className="text-center pt-6">
                    <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.avatar} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-32 h-32 mx-auto mb-4 object-contain" />
                    <p className="text-gray-400 text-sm">Inicia una conversación con {PROFESSORS.find((p) => p.id === selectedProfessor)?.name}</p>
                    <p className="text-gray-300 text-xs mt-1">Pregunta sobre {PROFESSORS.find((p) => p.id === selectedProfessor)?.subject.toLowerCase()}</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.pfp} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-8 h-8 rounded-full object-cover shadow-sm shrink-0" />
                    )}
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#0C043F] text-white rounded-br-md shadow-sm" : "bg-gray-50 text-gray-800 rounded-tl-md border border-gray-100 shadow-sm"}`}>
                      <MarkdownMessage content={msg.content} isUser={msg.role === "user"} />
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">T</div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
              <form onSubmit={sendChatMessage} className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm" placeholder={`Pregúntale a ${PROFESSORS.find((p) => p.id === selectedProfessor)?.name}...`} />
                  <button type="submit" disabled={!chatInput.trim()} className="bg-[#0C043F] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#0C043F]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-4">
              {teacherNotifList.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                    Notificaciones
                  </h2>
                  <div className="space-y-2">
                    {teacherNotifList.toReversed().map((n) => (
                      <div key={n.id} className="p-3 rounded-xl text-sm border text-left">
                        {n.type === "quiz_completed" && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            <span><strong>{n.studentName}</strong> completó "{n.topic}" — <span className="text-green-600">{n.score}/{n.total}</span></span>
                          </div>
                        )}
                        {n.type === "quiz_missed" && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            <span><strong>{n.studentName}</strong> NO entregó "{n.topic}" <span className="text-red-500">(vencido)</span></span>
                          </div>
                        )}
                        {!n.type && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <span>Nuevo quiz publicado: "{n.topic}"</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-400 ml-6 block mt-0.5">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="results" /> Resultados de Quizzes</h2>
              {results.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay resultados aún. Los alumnos deben completar quizzes para ver sus resultados aquí.</p>
              ) : (
                <div className="space-y-3">
                  {results.toReversed().map((r) => (
                    <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0C043F]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#0C043F]">{r.studentName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">{r.studentName}</span>
                            <span className="text-gray-400 mx-2">|</span>
                            <span className="text-[#0C043F] font-medium text-sm">{r.topic}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{r.submittedAt}</span>
                      </div>
                      <div className="flex gap-4 text-sm ml-10">
                        <span className="text-green-600 font-semibold">{r.score}/{r.total} correctas</span>
                        <span className="text-gray-500">({Math.round((r.score / r.total) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function QuizView({ questions, studentName, topic, onSubmitted, initialAnswers, initialSubmitted }) {
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [submitted, setSubmitted] = useState(initialSubmitted || false);

  if (!Array.isArray(questions)) return <p className="text-gray-500">Formato de quiz inválido</p>;

  const handleAnswer = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const correctCount = submitted ? questions.filter((q, i) => answers[i] === q.correctIndex).length : 0;

  const handleSubmit = async () => {
    const count = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    setSubmitted(true);
    if (studentName && topic && onSubmitted) {
      try { await fetch("/api/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentName, topic, score: count, total: questions.length, questions, userAnswers: answers }) }); onSubmitted(); } catch {}
    }
  };

  return (
    <div className="space-y-5">
      {questions.map((q, i) => {
        const hasAnswered = answers[i] !== undefined;
        return (
          <div key={i} className="border-b border-gray-100 pb-5 last:border-0">
            <p className="font-medium text-gray-800 mb-3 flex items-start gap-2">
              <span className="w-6 h-6 bg-[#0C043F]/10 text-[#0C043F] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span>{q.question}</span>
            </p>
            <div className="space-y-2 ml-8">
              {q.options.map((opt, j) => {
                const isSelected = answers[i] === j;
                const isCorrect = submitted && j === q.correctIndex;
                const isWrong = submitted && isSelected && j !== q.correctIndex;
                return (
                  <button key={j} onClick={() => handleAnswer(i, j)} disabled={submitted} className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition flex items-center gap-3 ${isSelected && !submitted ? "border-[#0C043F] bg-[#e71367]/10 ring-2 ring-[#e71367]/30" : isCorrect ? "border-green-500 bg-green-50 text-green-800" : isWrong ? "border-red-500 bg-red-50 text-red-800" : submitted && j === q.correctIndex ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"} ${!submitted && "cursor-pointer"}`}>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected && !submitted ? "border-[#0C043F] bg-[#0C043F]" : isCorrect || (submitted && j === q.correctIndex) ? "border-green-500 bg-green-500" : isWrong ? "border-red-500 bg-red-500" : "border-gray-300"}`}>
                      {(isSelected || isCorrect || (submitted && j === q.correctIndex)) && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && <svg className="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    {isWrong && <svg className="w-5 h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <div className="flex gap-3 items-center">
          <button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">Enviar Respuestas</button>
          <span className="text-xs text-gray-400">{Object.keys(answers).length} de {questions.length} respondidas</span>
        </div>
      )}

      {submitted && (
        <div className={`text-center p-5 rounded-xl ${correctCount === questions.length ? "bg-green-50 text-green-800 border border-green-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`}>
          <p className="text-lg font-bold">{correctCount} de {questions.length} correctas</p>
          <p className="text-sm opacity-75">({Math.round((correctCount / questions.length) * 100)}%)</p>
        </div>
      )}
    </div>
  );
}

function MemoryGame({ pairs }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (!pairs) return;
    const all = pairs.flatMap((p, i) => [
      { id: `t${i}`, pairIdx: i, text: p.term, type: "term" },
      { id: `d${i}`, pairIdx: i, text: p.definition, type: "def" },
    ]);
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    setCards(all);
    setFlipped([]); setMatched([]); setAttempts(0);
  }, [pairs]);

  const handleClick = (card) => {
    if (lock || flipped.includes(card.id) || matched.includes(card.pairIdx)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) {
      setLock(true);
      setAttempts((a) => a + 1);
      const [a, b] = next.map((id) => cards.find((c) => c.id === id));
      if (a.pairIdx === b.pairIdx && a.type !== b.type) {
        setMatched((m) => [...m, a.pairIdx]);
        setFlipped([]);
        setLock(false);
      } else {
        setTimeout(() => { setFlipped([]); setLock(false); }, 800);
      }
    }
  };

  if (!pairs) return null;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">Intentos: {attempts} | Pares: {matched.length}/{pairs.length}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.pairIdx);
          return (
            <button key={card.id} onClick={() => handleClick(card)}
              className={`h-20 rounded-xl text-xs font-medium transition-all duration-300 ${isFlipped ? "bg-[#0C043F]/10 text-[#0C043F] border border-[#0C043F]/50 scale-100" : "bg-[#0C043F] text-white hover:bg-[#0C043F]/90 scale-95 hover:scale-100"}`}>
              {isFlipped ? <span className="block p-1 leading-tight">{card.text}</span> : <span className="text-lg">?</span>}
            </button>
          );
        })}
      </div>
      {matched.length === pairs.length && <p className="text-center text-green-600 font-semibold mt-4">¡Completado en {attempts} intentos!</p>}
    </div>
  );
}

function HangmanGame({ words }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState([]);
  const MAX_WRONG = 6;

  const startNew = useCallback(() => {
    if (!words) return;
    const remaining = words.filter((w) => !done.includes(w.word));
    if (remaining.length === 0) { setCurrentWord(null); return; }
    const w = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentWord(w); setGuessed([]); setWrong(0);
  }, [words, done]);

  useEffect(() => { if (words && words.length > 0 && !currentWord) startNew(); }, [words, currentWord, startNew]);

  const handleLetter = (letter) => {
    if (!currentWord || guessed.includes(letter)) return;
    setGuessed((g) => [...g, letter]);
    if (!currentWord.word.includes(letter)) setWrong((w) => w + 1);
  };

  if (!words || words.length === 0) return <p className="text-gray-400 text-center">No hay palabras para jugar</p>;
  if (!currentWord) return <p className="text-green-600 text-center font-semibold">¡Completaste todas las palabras!</p>;

  const display = currentWord.word.split("").map((l) => (guessed.includes(l) ? l : "_")).join(" ");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="text-center">
      <div className="text-3xl font-mono tracking-widest mb-3">{display}</div>
      <p className="text-sm text-gray-500 mb-1">Pista: {currentWord.hint}</p>
      <p className="text-xs text-gray-400 mb-3">Errores: {wrong}/{MAX_WRONG}</p>
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {alphabet.map((l) => {
          const used = guessed.includes(l);
          const isCorrect = used && currentWord.word.includes(l);
          return (
            <button key={l} onClick={() => handleLetter(l)} disabled={used || wrong >= MAX_WRONG}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${used ? (isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700") : "bg-gray-100 text-gray-700 hover:bg-[#0C043F]/10"}`}>{l}</button>
          );
        })}
      </div>
      {wrong >= MAX_WRONG && <p className="text-red-600 font-semibold mb-2">¡Perdiste! La palabra era: <span className="font-mono">{currentWord.word}</span></p>}
      {(wrong >= MAX_WRONG || !display.includes("_")) && (
        <button onClick={() => { setDone((d) => [...d, currentWord.word]); startNew(); }} className="bg-[#0C043F] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#0C043F]/90 transition">
          {done.length < words.length - 1 ? "Siguiente palabra" : "Ver resultados"}
        </button>
      )}
      {!display.includes("_") && wrong < MAX_WRONG && <p className="text-green-600 font-semibold mb-2">¡Correcto!</p>}
    </div>
  );
}

function WordSearchGame({ words, onDone }) {
  const [grid, setGrid] = useState(null);
  const [found, setFound] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [selecting, setSelecting] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const maxLen = Math.max(...words.map((w) => w.word.length));
    const size = Math.max(maxLen + 2, 12);

    const dirs = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1],
    ];

    const g = Array.from({ length: size }, () => Array(size).fill(""));
    const placed = [];

    const sorted = [...words].sort((a, b) => b.word.length - a.word.length);

    for (const w of sorted) {
      const word = w.word;
      const dirsShuffled = [...dirs].sort(() => Math.random() - 0.5);
      let placedWord = false;
      for (const [dr, dc] of dirsShuffled) {
        const maxR = dr > 0 ? size - word.length : dr < 0 ? word.length - 1 : size - 1;
        const minR = dr < 0 ? word.length - 1 : 0;
        const maxC = dc > 0 ? size - word.length : dc < 0 ? word.length - 1 : size - 1;
        const minC = dc < 0 ? word.length - 1 : 0;
        if (maxR < minR || maxC < minC) continue;

        const positions = [];
        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) {
            let ok = true;
            for (let k = 0; k < word.length; k++) {
              const nr = r + k * dr;
              const nc = c + k * dc;
              if (g[nr][nc] !== "" && g[nr][nc] !== word[k]) { ok = false; break; }
            }
            if (ok) positions.push([r, c]);
          }
        }
        if (positions.length > 0) {
          const [r, c] = positions[Math.floor(Math.random() * positions.length)];
          const cells = [];
          for (let k = 0; k < word.length; k++) {
            const nr = r + k * dr;
            const nc = c + k * dc;
            g[nr][nc] = word[k];
            cells.push([nr, nc]);
          }
          placed.push({ word: w.word, hint: w.hint, cells });
          placedWord = true;
          break;
        }
      }
      if (!placedWord) {
        const [r, c] = [Math.floor(Math.random() * (size - word.length)), Math.floor(Math.random() * (size - word.length))];
        const cells = [];
        for (let k = 0; k < word.length; k++) {
          g[r][c + k] = word[k];
          cells.push([r, c + k]);
        }
        placed.push({ word: w.word, hint: w.hint, cells });
      }
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (g[r][c] === "") g[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
    setGrid(g);
    setPlacedWords(placed);
    setFound([]);
  }, [words]);

  const handleCellClick = (r, c) => {
    if (!selecting) {
      setSelecting([r, c]);
    } else {
      const [sr, sc] = selecting;
      const dr = Math.sign(r - sr);
      const dc = Math.sign(c - sc);
      if (dr === 0 && dc === 0) { setSelecting(null); return; }
      const len = Math.max(Math.abs(r - sr), Math.abs(c - sc)) + 1;
      const selectedCells = [];
      for (let k = 0; k < len; k++) {
        selectedCells.push([sr + k * dr, sc + k * dc]);
      }

      const selectedWord = selectedCells.map(([rr, cc]) => grid[rr]?.[cc]).join("");
      const matchedWord = words.find((w) => !found.includes(w.word) && (selectedWord === w.word || [...selectedWord].reverse().join("") === w.word));

      if (matchedWord) {
        setFound((prev) => [...prev, matchedWord.word]);
      }
      setSelecting(null);
    }
  };

  const isSelected = (r, c) => {
    if (!selecting) return false;
    const [sr, sc] = selecting;
    const dr = Math.sign(r - sr);
    const dc = Math.sign(c - sc);
    const len = Math.max(Math.abs(r - sr), Math.abs(c - sc)) + 1;
    for (let k = 0; k < len; k++) {
      if (sr + k * dr === r && sc + k * dc === c) return true;
    }
    return false;
  };

  if (!grid || !words) return null;

  const allFound = found.length === words.length;

  return (
    <div>
      {allFound ? (
        <div className="text-center py-4">
          <p className="text-green-600 font-semibold text-lg">¡Encontraste todas las palabras!</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-3 text-center">
            {selecting ? "Selecciona la última letra de la palabra" : "Haz clic en la primera letra de una palabra"}
          </div>
          <div ref={gridRef} className="grid place-items-center mb-4 select-none" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`, maxWidth: "28rem", margin: "0 auto" }}>
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isStart = selecting && selecting[0] === r && selecting[1] === c;
                const inSelection = isSelected(r, c);
                const isFound = found.some((fw) => placedWords.find((pw) => pw.word === fw)?.cells?.some(([cr, cc]) => cr === r && cc === c));
                return (
                  <button key={`${r}-${c}`} onClick={() => handleCellClick(r, c)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center text-xs sm:text-sm font-bold rounded transition-all ${
                      isFound ? "bg-green-200 text-green-800 border border-green-400 scale-105" :
                      isStart ? "bg-[#0C043F] text-white scale-110 shadow-md" :
                      inSelection ? "bg-[#e71367]/20 text-[#0C043F] scale-105" :
                      "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}>
                    {letter}
                  </button>
                );
              })
            )}
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            {words.map((w) => (
              <div key={w.word} className={`flex justify-between items-center px-3 py-1.5 rounded-lg text-sm ${found.includes(w.word) ? "bg-green-50 text-green-700 line-through" : "bg-gray-50 text-gray-600"}`}>
                <span className="font-mono font-bold">{w.word}</span>
                <span className="text-xs">{w.hint}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StudentDashboard({ user, onLogout }) {
  const [selectedProfessor, setSelectedProfessor] = useState(PROFESSORS[0].id);
  const [chatMessagesByProf, setChatMessagesByProf] = useState({});
  const [chatInput, setChatInput] = useState("");

  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [studentResults, setStudentResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [hasContext, setHasContext] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [gameType, setGameType] = useState("memory");
  const [gameContent, setGameContent] = useState("");
  const [gameTopic, setGameTopic] = useState("");
  const [gameData, setGameData] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [reelsTopic, setReelsTopic] = useState("");
  const [reelsContent, setReelsContent] = useState("");
  const [reels, setReels] = useState(null);
  const [reelsLoading, setReelsLoading] = useState(false);
  const [currentReel, setCurrentReel] = useState(0);
  const [reelsMuted, setReelsMuted] = useState(false);
  const [studentLevel, setStudentLevel] = useState(user.level || "3ro");
  const [studentSubject, setStudentSubject] = useState("");
  const chatBottomRef = useRef(null);
  const reelsScrollRef = useRef(null);

  useEffect(() => {
    if (!reels?.reels?.[currentReel] || reelsMuted || activeTab !== "reels") return;
    window.speechSynthesis.cancel();
    const text = `${reels.reels[currentReel].title}. ${reels.reels[currentReel].content}. ${reels.reels[currentReel].tip || ""}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [currentReel, reels, reelsMuted, activeTab]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessagesByProf[selectedProfessor]]);

  const loadAvailableQuizzes = useCallback(async () => { try { const params = new URLSearchParams({ level: studentLevel }); if (studentSubject) params.set("subject", studentSubject); const res = await fetch(`/api/quizzes?${params}`); const data = await res.json(); setAvailableQuizzes(data); } catch {} }, [studentLevel, studentSubject]);
  useEffect(() => { if (activeTab === "quiz") loadAvailableQuizzes(); }, [activeTab, loadAvailableQuizzes]);

  const updateStudentLevel = async (newLevel) => {
    setStudentLevel(newLevel);
    try { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update-level", username: user.name, level: newLevel }) }); } catch {}
  };

  const startTeacherQuiz = (q) => { setSelectedQuizId(q.id); setQuiz(q.questions); setTopic(q.topic); setQuizSubmitted(false); };

  const generateQuiz = async () => {
    if (!content.trim() || !topic.trim()) return;
    setLoading(true); setQuiz(null); setSelectedQuizId(null);
    try { const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, topic, count: questionCount }) }); const data = await res.json(); setQuiz(data); } catch (e) { alert("Error al generar el quiz: " + e.message); }
    setLoading(false);
  };

  const loadStudentResults = useCallback(async () => {
    try { const res = await fetch("/api/results"); const data = await res.json(); setStudentResults(data.filter((r) => r.studentName === user.name)); } catch {}
  }, [user.name]);

  const checkContext = useCallback(async () => {
    try { const res = await fetch("/api/context"); const data = await res.json(); setHasContext(!!(data.text && data.text.trim())); } catch {}
  }, []);

  const loadNotifs = useCallback(async () => {
    try { const res = await fetch(`/api/notifications?userName=${user.name}`); const data = await res.json(); setUnreadNotifs(data.length); } catch {}
  }, [user.name]);

  const markNotifRead = useCallback(async () => {
    try { const res = await fetch(`/api/notifications?userName=${user.name}`); const data = await res.json(); for (const n of data) { await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notifId: n.id, userName: user.name }) }); } setUnreadNotifs(0); } catch {}
  }, [user.name]);

  useEffect(() => { if (activeTab === "results") loadStudentResults(); if (activeTab === "chat") checkContext(); loadNotifs(); }, [activeTab, loadStudentResults, checkContext, loadNotifs]);

  const generateReels = async () => {
    if (!reelsContent.trim() || !reelsTopic.trim()) return;
    setReelsLoading(true); setReels(null); setCurrentReel(0);
    try { const res = await fetch("/api/generate-reels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: reelsContent, topic: reelsTopic }) }); const data = await res.json(); setReels(data); } catch { alert("Error al generar los reels"); }
    setReelsLoading(false);
  };

  const generateGame = async () => {
    if (!gameContent.trim() || !gameTopic.trim()) return;
    setGameLoading(true); setGameData(null);
    try { const res = await fetch("/api/generate-game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: gameContent, topic: gameTopic, type: gameType }) }); const data = await res.json(); setGameData(data); } catch (e) { alert("Error: " + e.message); }
    setGameLoading(false);
  };

  const chatMessages = chatMessagesByProf[selectedProfessor] || [];

  const saveChatHistory = async (profId, msgs) => {
    try { await fetch("/api/chat-history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userName: user.name, professorId: profId, messages: msgs }) }); } catch {}
  };

  useEffect(() => {
    if (activeTab === "chat") {
      (async () => {
        try { const res = await fetch(`/api/chat-history?userName=${user.name}&professorId=${selectedProfessor}`); const data = await res.json(); if (data.messages && data.messages.length > 0) setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: data.messages })); } catch {}
      })();
    }
  }, [activeTab, selectedProfessor, user.name]);

  const sendChatMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim()) return;
    const current = chatMessagesByProf[selectedProfessor] || [];
    const newMessages = [...current, { role: "user", content: chatInput }];
    setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: newMessages }));
    setChatInput("");
    try { const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages, expert: selectedProfessor }) }); const data = await res.json();
      const withReply = [...newMessages, { role: "assistant", content: data.text || data.error || "Error desconocido" }];
      setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: withReply }));
      saveChatHistory(selectedProfessor, withReply);
    } catch {
      const withError = [...newMessages, { role: "assistant", content: "Error al conectar con el chatbot." }];
      setChatMessagesByProf((prev) => ({ ...prev, [selectedProfessor]: withError }));
    }
  };

  const tabs = [
    { id: "chat", label: "Chatbots" },
    { id: "quiz", label: "Quizzes" },
    { id: "reels", label: "Reels" },
    { id: "juegos", label: "Juegos" },
    { id: "results", label: "Mis Resultados" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader title="Panel de Alumno" userName={user.name} onLogout={onLogout} notifCount={unreadNotifs} onNotifClick={() => { markNotifRead(); setActiveTab("quiz"); }} />
        <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
          <MobileNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.pfp} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{PROFESSORS.find((p) => p.id === selectedProfessor)?.name}</h2>
                    <p className="text-xs text-gray-400">{PROFESSORS.find((p) => p.id === selectedProfessor)?.subject}</p>
                  </div>
                  {hasContext && <span className="ml-auto inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Contexto activo</span>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {PROFESSORS.map((p) => {
                    const profMsgs = chatMessagesByProf[p.id] || [];
                    return (
                      <button key={p.id} onClick={() => setSelectedProfessor(p.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${selectedProfessor === p.id ? "bg-[#0C043F] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        <span className={`w-2 h-2 rounded-full ${profMsgs.length > 0 ? "bg-green-400" : "bg-gray-300"}`} />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center pt-6">
                    <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.avatar} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-32 h-32 mx-auto mb-4 object-contain" />
                    <p className="text-gray-400 text-sm">Pregúntale a {PROFESSORS.find((p) => p.id === selectedProfessor)?.name}</p>
                    <p className="text-gray-300 text-xs mt-1">Sobre {PROFESSORS.find((p) => p.id === selectedProfessor)?.subject.toLowerCase()}</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <img src={PROFESSORS.find((p) => p.id === selectedProfessor)?.pfp} alt={PROFESSORS.find((p) => p.id === selectedProfessor)?.name} className="w-8 h-8 rounded-full object-cover shadow-sm shrink-0" />
                    )}
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#0C043F] text-white rounded-br-md shadow-sm" : "bg-gray-50 text-gray-800 rounded-tl-md border border-gray-100 shadow-sm"}`}>
                      <MarkdownMessage content={msg.content} isUser={msg.role === "user"} />
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">A</div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
              <form onSubmit={sendChatMessage} className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm" placeholder={`Pregúntale a ${PROFESSORS.find((p) => p.id === selectedProfessor)?.name}...`} />
                  <button type="submit" disabled={!chatInput.trim()} className="bg-[#0C043F] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#0C043F]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <span className="text-sm font-medium text-gray-700">Curso:</span>
                  <div className="flex gap-1">
                    {["3ro", "4to", "5to"].map((lvl) => (
                      <button key={lvl} onClick={() => updateStudentLevel(lvl)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${studentLevel === lvl ? "bg-[#0C043F] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Materia:</span>
                  <div className="flex gap-1">
                    {["", "Hardware", "Software", "Redes", "TIMI"].map((sub) => (
                      <button key={sub || "todas"} onClick={() => setStudentSubject(sub)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${studentSubject === sub ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {sub || "Todas"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {availableQuizzes.length > 0 && !selectedQuizId && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><TabIcon id="quiz" /> Quizzes del Docente</h2>
                  <div className="space-y-2">
                    {availableQuizzes.map((q) => {
                      const isExpired = q.deadline && new Date(q.deadline) < new Date();
                      return (
                      <button key={q.id} onClick={() => !isExpired && startTeacherQuiz(q)} className={`w-full text-left p-4 border rounded-xl transition flex items-center gap-3 ${isExpired ? "border-red-200 bg-red-50 opacity-60 cursor-not-allowed" : "border-gray-200 hover:bg-[#e71367]/10 hover:border-[#e71367]/50"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isExpired ? "bg-red-100" : "bg-[#0C043F]/10"}`}>
                          <svg className={`w-5 h-5 ${isExpired ? "text-red-400" : "text-[#0C043F]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{q.topic}</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(q.publishedAt).toLocaleString()}
                            {q.level && <span className="ml-1 text-[#0C043F] font-medium">{q.level}</span>}
                            {q.subject && <span className="ml-1 text-emerald-600 font-medium">{q.subject}</span>}
                            {q.deadline && (
                              <span className={`ml-2 ${isExpired ? "text-red-500" : "text-orange-500"}`}>
                                {isExpired ? "⛔ Vencido" : "⌛ " + new Date(q.deadline).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><TabIcon id="quiz" /> {selectedQuizId ? "Quiz del Docente" : "Generar Quiz de Práctica"}</h2>
                {!selectedQuizId && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Tema</label>
                      <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ej: Programación en Python" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido a evaluar</label>
                      <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" placeholder="Escribe el contenido que quieres practicar..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Cantidad de preguntas</label>
                      <input type="number" value={questionCount} onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 5))} min={1} max={20} className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <button onClick={generateQuiz} disabled={loading || !content.trim() || !topic.trim()} className="bg-gradient-to-r from-[#0C043F] to-[#e71367] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#0C043F]/90 hover:to-[#e71367]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">{loading ? "Generando..." : "Generar Quiz"}</button>
                  </div>
                )}
              </div>

              {quiz && !quiz.error && !quizSubmitted && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz: {topic}</h3>
                  <QuizView questions={quiz} studentName={user.name} topic={topic} onSubmitted={() => setQuizSubmitted(true)} />
                </div>
              )}

              {quizSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-green-700 font-semibold text-lg mb-1">¡Quiz completado!</p>
                  <p className="text-green-600 text-sm mb-6">Tu resultado ha sido enviado al docente.</p>
                  <button onClick={() => { setQuiz(null); setQuizSubmitted(false); setTopic(""); setContent(""); setSelectedQuizId(null); }} className="bg-[#0C043F] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#0C043F]/90 transition shadow-sm">Volver a quizzes</button>
                </div>
              )}

              {quiz?.error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{quiz.error}</div>}
            </div>
          )}

          {activeTab === "reels" && (
            <div className="space-y-4">
              {!reels ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="reels" /> Reels Educativos con IA</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Tema</label>
                      <input type="text" value={reelsTopic} onChange={(e) => setReelsTopic(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ej: Redes de computadoras" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido</label>
                      <textarea value={reelsContent} onChange={(e) => setReelsContent(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" placeholder="Escribe el contenido educativo para generar los reels..." />
                    </div>
                    <button onClick={generateReels} disabled={reelsLoading || !reelsContent.trim() || !reelsTopic.trim()} className="bg-gradient-to-r from-[#0C043F] to-[#e71367] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#0C043F]/90 hover:to-[#e71367]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">{reelsLoading ? "Generando..." : "Generar Reels"}</button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {reels.error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <p className="text-red-500 text-sm">{reels.error}</p>
                      <button onClick={() => setReels(null)} className="mt-3 text-[#0C043F] text-sm hover:underline">Volver</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3 px-1">
                        <button onClick={() => { window.speechSynthesis.cancel(); setReels(null); }} className="text-sm text-[#0C043F] hover:text-[#0C043F] flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          Nuevos reels
                        </button>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setReelsMuted((m) => !m)} className="text-sm text-gray-500 hover:text-gray-700 transition" title={reelsMuted ? "Activar audio" : "Silenciar"}>
                            {reelsMuted ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                            )}
                          </button>
                          <span className="text-xs text-gray-400">{currentReel + 1} / {reels.reels?.length || 0}</span>
                        </div>
                      </div>
                      {currentReel > 0 && <div className="absolute top-14 left-0 right-0 z-10 flex gap-1 px-6"><div className="h-1 flex-1 rounded-full bg-white/30"><div className="h-1 rounded-full bg-white transition-all" style={{ width: `${((currentReel) / (reels.reels?.length || 1)) * 100}%` }} /></div></div>}
                      <div ref={reelsScrollRef} onScroll={() => { if (reelsScrollRef.current && reels?.reels) { const idx = Math.round(reelsScrollRef.current.scrollTop / reelsScrollRef.current.clientHeight); setCurrentReel(Math.min(idx, reels.reels.length - 1)); } }} className="snap-y snap-mandatory h-[calc(100vh-16rem)] overflow-y-scroll rounded-2xl scroll-smooth" style={{ scrollbarWidth: "none" }}>
                        {reels.reels?.map((reel, i) => {
                          const gradients = [
                            "from-violet-600 via-purple-600 to-pink-500",
                            "from-cyan-500 via-blue-500 to-[#0C043F]",
                            "from-emerald-500 via-teal-500 to-cyan-600",
                            "from-orange-500 via-red-500 to-rose-600",
                            "from-fuchsia-500 via-pink-500 to-rose-500",
                            "from-amber-400 via-orange-500 to-red-500",
                            "from-sky-400 via-blue-500 to-[#0C043F]",
                            "from-lime-400 via-green-400 to-emerald-500",
                          ];
                          const g = gradients[i % gradients.length];
                          return (
                          <div key={i} className="snap-start h-full flex items-center justify-center p-2 first:pt-0 last:pb-0">
                            <div className={`bg-gradient-to-br ${g} rounded-2xl p-8 w-full max-w-md mx-auto min-h-[28rem] flex flex-col items-center justify-center text-white shadow-xl`}>
                              <div className="text-6xl mb-4">{reel.emoji}</div>
                              <h3 className="text-xl font-bold text-center mb-3 leading-tight drop-shadow-sm">{reel.title}</h3>
                              <p className="text-base text-center leading-relaxed text-white/90 mb-5 max-w-sm">{reel.content}</p>
                              {reel.tip && (
                                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 w-full max-w-sm border border-white/10 shadow-inner">
                                  <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1 flex items-center gap-1">⚡ Dato Clave</p>
                                  <p className="text-sm text-white/95 leading-relaxed font-medium">{reel.tip}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        {reels.reels?.map((_, i) => (
                          <button key={i} onClick={() => { if (reelsScrollRef.current) { reelsScrollRef.current.scrollTo({ top: i * reelsScrollRef.current.clientHeight, behavior: "smooth" }); } }} className={`w-2 h-2 rounded-full transition-all ${i === currentReel ? "bg-[#0C043F] w-5" : "bg-gray-300 hover:bg-gray-400"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "juegos" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="juegos" /> Juegos Educativos con IA</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tema</label>
                    <input type="text" value={gameTopic} onChange={(e) => setGameTopic(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Ej: Programación en Python" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenido</label>
                    <textarea value={gameContent} onChange={(e) => setGameContent(e.target.value)} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" placeholder="Escribe el contenido educativo para generar el juego..." />
                  </div>
                  <div className="flex gap-2">
                    {["memory", "hangman", "wordsearch"].map((t) => (
                      <button key={t} onClick={() => setGameType(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${gameType === t ? "bg-[#0C043F] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {t === "memory" ? "🧠 Memoria" : t === "hangman" ? "💀 Ahorcado" : "🔍 Sopa de Letras"}
                      </button>
                    ))}
                  </div>
                  <button onClick={generateGame} disabled={gameLoading || !gameContent.trim() || !gameTopic.trim()} className="bg-gradient-to-r from-[#0C043F] to-[#e71367] text-white px-6 py-2.5 rounded-xl font-medium hover:from-[#0C043F]/90 hover:to-[#e71367]/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">{gameLoading ? "Generando..." : "Generar Juego"}</button>
                </div>
              </div>

              {gameData?.error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{gameData.error}</div>}

              {gameData?.data && !gameData.error && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{gameType === "memory" ? "🧠 Juego de Memoria" : gameType === "hangman" ? "💀 Ahorcado" : "🔍 Sopa de Letras"}</h3>
                  {gameType === "memory" && <MemoryGame pairs={gameData.data} />}
                  {gameType === "hangman" && <HangmanGame words={gameData.data} />}
                  {gameType === "wordsearch" && <WordSearchGame words={gameData.data} />}
                </div>
              )}
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {selectedResult ? (
                <div>
                  <button onClick={() => setSelectedResult(null)} className="text-sm text-[#0C043F] hover:text-[#0C043F] flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver a mis resultados
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz: {selectedResult.topic}</h3>
                  <div className="mb-4 p-3 bg-[#e71367]/10 rounded-xl text-sm">
                    <span className="font-semibold text-[#0C043F]">{selectedResult.score}/{selectedResult.total} correctas</span>
                    <span className="text-[#e71367] ml-2">({Math.round((selectedResult.score / selectedResult.total) * 100)}%)</span>
                  </div>
                  <QuizView questions={selectedResult.questions} initialAnswers={selectedResult.userAnswers} initialSubmitted={true} />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"><TabIcon id="results" /> Mis Resultados</h2>
                  {studentResults.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No tienes resultados aún. Completa un quiz para verlo aquí.</p>
                  ) : (
                    <div className="space-y-3">
                      {studentResults.toReversed().map((r) => (
                        <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => { if (r.questions && r.userAnswers) setSelectedResult(r); }}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#0C043F]/10 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#0C043F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                              </div>
                              <span className="font-semibold text-gray-800">{r.topic}</span>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(r.submittedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-4 text-sm ml-10">
                            <span className="text-green-600 font-semibold">{r.score}/{r.total} correctas</span>
                            <span className="text-gray-500">({Math.round((r.score / r.total) * 100)}%)</span>
                            {(!r.questions || !r.userAnswers) && <span className="text-gray-400 text-xs">(detalle no disponible)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
