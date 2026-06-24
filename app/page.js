"use client";

import { useState } from "react";

const PROFESSORS = [
  { id: "software", name: "Dr. López", subject: "Programación" },
  { id: "hardware", name: "Ing. Martínez", subject: "Hardware" },
  { id: "timi", name: "Mtro. García", subject: "TIMI" },
  { id: "redes", name: "Ing. Rodríguez", subject: "Redes" },
];

export default function Home() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("login");
  const [user, setUser] = useState({ name: "", role: "" });

  if (view === "login") {
    return <Login onLogin={(name, r) => { setUser({ name, role: r }); setView(r === "teacher" ? "teacher-dashboard" : "student-dashboard"); }} />;
  }
  if (user.role === "teacher") return <TeacherDashboard user={user} onLogout={() => setView("login")} />;
  return <StudentDashboard user={user} onLogout={() => setView("login")} />;
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const TEACHER_CREDENTIALS = { user: "docente", pass: "docente123" };
  const STUDENT_CREDENTIALS = { user: "alumno", pass: "alumno123" };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (role === "teacher") {
      if (name === TEACHER_CREDENTIALS.user && password === TEACHER_CREDENTIALS.pass) {
        onLogin(name, "teacher");
      } else {
        setError("Credenciales de docente incorrectas");
      }
    } else {
      if (name === STUDENT_CREDENTIALS.user && password === STUDENT_CREDENTIALS.pass) {
        onLogin(name, "student");
      } else {
        setError("Credenciales de alumno incorrectas");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">EduQuiz AI</h1>
          <p className="text-gray-500 mt-1">Plataforma Educativa con Inteligencia Artificial</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button type="button" onClick={() => setRole("student")} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === "student" ? "bg-white shadow text-indigo-700" : "text-gray-500"}`}>Alumno</button>
            <button type="button" onClick={() => setRole("teacher")} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === "teacher" ? "bg-white shadow text-indigo-700" : "text-gray-500"}`}>Docente</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder={role === "teacher" ? "docente" : "alumno"} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder="••••••" required />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">Iniciar Sesión</button>
        </form>

        <div className="mt-6 text-xs text-gray-400 text-center space-y-1">
          <p><strong>Demo:</strong> docente / docente123 | alumno / alumno123</p>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ user, onLogout }) {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState(PROFESSORS[0].id);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  const generateQuiz = async () => {
    if (!content.trim() || !topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, topic }),
      });
      const data = await res.json();
      setQuiz(data);
    } catch {
      alert("Error al generar el quiz");
    }
    setLoading(false);
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, expert: selectedProfessor }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch {
      setChatMessages([...newMessages, { role: "assistant", content: "Error al conectar con el chatbot." }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">EduQuiz AI - Panel Docente</h1>
          <div className="flex items-center gap-4">
            <span className="text-indigo-200">Bienvenido, {user.name}</span>
            <button onClick={onLogout} className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
          {[
            { id: "content", label: "Subir Contenido" },
            { id: "quiz", label: "Generar Quiz" },
            { id: "chat", label: "Chatbot" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-indigo-600"}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "content" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Subir Contenido Educativo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tema / Título</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder="Ej: Introducción a Python" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contenido</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-y" placeholder="Escribe o pega el contenido educativo aquí..." />
              </div>
              <button onClick={() => alert("Contenido guardado. Ve a la pestaña Generar Quiz para crear un cuestionario.")} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">Guardar Contenido</button>
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Generar Quiz con IA</h2>
              <p className="text-sm text-gray-500 mb-4">Usa el contenido que subiste o escribe nuevo contenido para generar un quiz automático.</p>
              <div className="flex gap-3">
                <button onClick={generateQuiz} disabled={loading || !content.trim() || !topic.trim()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">{loading ? "Generando..." : "Generar Quiz"} </button>
              </div>
            </div>

            {quiz && !quiz.error && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Generado</h3>
                <QuizView questions={quiz} />
              </div>
            )}

            {quiz?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{quiz.error}</div>
            )}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <div className="flex gap-2">
                {PROFESSORS.map((p) => (
                  <button key={p.id} onClick={() => setSelectedProfessor(p.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedProfessor === p.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p.name}</button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Chatbot: {PROFESSORS.find((p) => p.id === selectedProfessor)?.name} - {PROFESSORS.find((p) => p.id === selectedProfessor)?.subject}</p>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && <p className="text-gray-400 text-center pt-10">Inicia una conversación con el chatbot</p>}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>{msg.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={sendChatMessage} className="p-4 border-t flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder="Escribe tu mensaje..." />
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function QuizView({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!Array.isArray(questions)) return <p className="text-gray-500">Formato de quiz inválido</p>;

  const handleAnswer = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const correctCount = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="border-b pb-4 last:border-0">
          <p className="font-medium text-gray-800 mb-2">{i + 1}. {q.question}</p>
          <div className="space-y-1.5">
            {q.options.map((opt, j) => {
              const isSelected = answers[i] === j;
              const isCorrect = submitted && j === q.correctIndex;
              const isWrong = submitted && isSelected && j !== q.correctIndex;
              return (
                <button key={j} onClick={() => handleAnswer(i, j)} className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition ${isSelected && !submitted ? "border-indigo-500 bg-indigo-50" : ""} ${isCorrect ? "border-green-500 bg-green-50 text-green-800" : ""} ${isWrong ? "border-red-500 bg-red-50 text-red-800" : ""} ${!isSelected && !submitted ? "border-gray-200 hover:border-gray-300" : ""}`}>{opt}</button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button onClick={() => setSubmitted(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition">Enviar Respuestas</button>
      )}

      {submitted && (
        <div className={`text-center p-4 rounded-lg ${correctCount === questions.length ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          <p className="font-semibold">{correctCount} de {questions.length} correctas ({Math.round((correctCount / questions.length) * 100)}%)</p>
        </div>
      )}
    </div>
  );
}

function StudentDashboard({ user, onLogout }) {
  const [selectedProfessor, setSelectedProfessor] = useState(PROFESSORS[0].id);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const generateQuiz = async () => {
    if (!content.trim() || !topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, topic }),
      });
      const data = await res.json();
      setQuiz(data);
    } catch {
      alert("Error al generar el quiz");
    }
    setLoading(false);
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, expert: selectedProfessor }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch {
      setChatMessages([...newMessages, { role: "assistant", content: "Error al conectar con el chatbot." }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">EduQuiz AI - Panel de Alumno</h1>
          <div className="flex items-center gap-4">
            <span className="text-indigo-200">Bienvenido, {user.name}</span>
            <button onClick={onLogout} className="bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
          {[
            { id: "chat", label: "Chatbots" },
            { id: "quiz", label: "Practicar Quiz" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-indigo-600"}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <div className="flex gap-2">
                {PROFESSORS.map((p) => (
                  <button key={p.id} onClick={() => { setSelectedProfessor(p.id); setChatMessages([]); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedProfessor === p.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p.name}</button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Chatbot: {PROFESSORS.find((p) => p.id === selectedProfessor)?.name} - {PROFESSORS.find((p) => p.id === selectedProfessor)?.subject}</p>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && <p className="text-gray-400 text-center pt-10">Selecciona un profesor y haz una pregunta</p>}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>{msg.content}</div>
                </div>
              ))}
            </div>

            <form onSubmit={sendChatMessage} className="p-4 border-t flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder="Haz una pregunta..." />
              <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Enviar</button>
            </form>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Generar Quiz de Práctica</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tema</label>
                  <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" placeholder="Ej: Programación en Python" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contenido a evaluar</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-y" placeholder="Escribe el contenido que quieres practicar..." />
                </div>
                <button onClick={generateQuiz} disabled={loading || !content.trim() || !topic.trim()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">{loading ? "Generando..." : "Generar Quiz"} </button>
              </div>
            </div>

            {quiz && !quiz.error && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz de Práctica</h3>
                <QuizView questions={quiz} />
              </div>
            )}

            {quiz?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{quiz.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
