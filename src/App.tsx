import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { 
  BookOpen, 
  Upload, 
  History, 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  ChevronRight, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Download,
  AlertCircle,
  X,
  Menu,
  Moon,
  Sun,
  Users,
  Building2,
  Book,
  Zap,
  Plus,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface StudyResult {
  story: string;
  detailed_context: string;
  notes: {
    causes: string[];
    events: string[];
    effects: string[];
    facts: string[];
  };
  timeline: {
    year: string;
    event: string;
  }[];
  people: {
    leaders: string[];
    organizations: string[];
    terms: string[];
  };
  quiz: {
    mcqs: {
      question: string;
      options: string[];
      answer: string;
    }[];
    short_questions: string[];
  };
  quick_revision: string[];
}

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  result: StudyResult;
}

// --- Components ---

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Zap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Simplify<span className="text-indigo-600">X</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">My Library</Link>
            <Link to="/upload" className="text-sm font-black text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">New Study</Link>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={20} className="text-slate-300" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-widest">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block px-4 py-1.5 mb-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800"
        >
          🚀 Study like a Superhuman
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.85]"
        >
          History for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Everyone! 🌍</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          I explain complex stuff so simply that even a one-cell organism could get it. 🦠✨
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
            <Upload size={20} />
            Upload Your Chapter
          </Link>
          <Link to="/dashboard" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2">
            View Recent Notes
          </Link>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ImageIcon className="text-indigo-600" />, title: "Photo to Notes", desc: "Just snap a photo of your book. Our OCR handles the rest." },
            { icon: <FileText className="text-violet-600" />, title: "PDF Support", desc: "Upload full chapters. We extract and summarize everything." },
            { icon: <Sparkles className="text-fuchsia-600" />, title: "AI Structured", desc: "Get stories, timelines, and quizzes automatically generated." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-left"
            >
              <div className="bg-slate-50 dark:bg-slate-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ history }: { history: HistoryItem[] }) => {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">My Study <span className="text-indigo-600">Vault</span> 💎</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium italic">All your super-simple notes in one place. 🚀</p>
        </div>
        <Link to="/upload" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-2 uppercase tracking-widest">
          <Plus size={24} />
          New Study
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-20 text-center">
          <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No notes yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto">Upload your first chapter to start building your study library.</p>
          <Link to="/upload" className="text-indigo-600 font-bold hover:underline">Upload now →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <Link key={item.id} to={`/output/${item.id}`} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl hover:shadow-xl hover:shadow-indigo-500/10 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>View Notes</span>
                <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const UploadPage = ({ onProcess }: { onProcess: (files: File[]) => void }) => {
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (files.length === 0) return;
    onProcess(files);
    navigate("/processing");
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Feed Me Your <span className="text-indigo-600">Chapters!</span> 📚
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">I'll turn them into super simple notes for your brain. 🧠✨</p>
      </div>

      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer",
          isDragActive ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400"
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-indigo-50 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Upload className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">or click to browse from your computer</p>
        <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">Supports JPG, PNG, PDF</p>
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Selected Files ({files.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg shrink-0">
                    {file.type.startsWith('image/') ? <ImageIcon size={18} className="text-indigo-600" /> : <FileText size={18} className="text-violet-600" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleGenerate}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Generate Smart Notes
          </button>
        </div>
      )}
    </div>
  );
};

const ProcessingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "🧠 Brain is thinking really hard...",
    "🔍 Looking at all the pictures...",
    "📝 Writing super simple notes...",
    "✨ Adding some magic dust...",
    "🚀 Getting ready for takeoff...",
    "🦖 Even a dinosaur could understand this...",
    "🍭 Making it sweet and simple...",
    "💎 Finding the hidden gems..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="relative w-24 h-24 mb-12">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-indigo-600 animate-pulse" size={32} />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.h2 
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-bold text-slate-900 dark:text-white text-center"
        >
          {messages[messageIndex]}
        </motion.h2>
      </AnimatePresence>
      <p className="text-slate-500 dark:text-slate-400 mt-4">This usually takes about 30-60 seconds.</p>
    </div>
  );
};

const OutputPage = ({ result }: { result: StudyResult }) => {
  const [activeTab, setActiveTab] = useState<string>("story");
  const [copied, setCopied] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const tabs = [
    { id: "story", label: "📖 Story", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { id: "context", label: "🔍 Context", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "notes", label: "📝 Notes", color: "bg-rose-100 text-rose-700 border-rose-200" },
    { id: "timeline", label: "📅 Timeline", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { id: "people", label: "👤 People", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { id: "quiz", label: "🧠 Quiz", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: "revision", label: "⚡ Revision", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" }
  ];

  const handleCopy = () => {
    let textToCopy = "";
    if (activeTab === "story") textToCopy = result?.story || "";
    else if (activeTab === "context") textToCopy = result?.detailed_context || "";
    else if (activeTab === "notes") {
      textToCopy = `Causes:\n${(result?.notes?.causes || []).join("\n")}\n\nEvents:\n${(result?.notes?.events || []).join("\n")}\n\nEffects:\n${(result?.notes?.effects || []).join("\n")}\n\nFacts:\n${(result?.notes?.facts || []).join("\n")}`;
    } else if (activeTab === "timeline") {
      textToCopy = (result?.timeline || []).map(t => `${t.year}: ${t.event}`).join("\n");
    } else if (activeTab === "people") {
      textToCopy = `Leaders:\n${(result?.people?.leaders || []).join("\n")}\n\nOrganizations:\n${(result?.people?.organizations || []).join("\n")}\n\nTerms:\n${(result?.people?.terms || []).join("\n")}`;
    } else if (activeTab === "quiz") {
      textToCopy = `MCQs:\n${(result?.quiz?.mcqs || []).map(m => `${m.question}\nOptions: ${m.options.join(", ")}\nAnswer: ${m.answer}`).join("\n\n")}\n\nShort Questions:\n${(result?.quiz?.short_questions || []).join("\n")}`;
    } else if (activeTab === "revision") {
      textToCopy = (result?.quick_revision || []).join("\n");
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.print();
  };

  const toggleAnswer = (index: number) => {
    setRevealedAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Study Notes <span className="text-indigo-600">Ready!</span> 🚀</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Your chapter has been broken down into tiny, easy pieces. 🧩</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none"
          >
            {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Everything"}
          </button>
          <button 
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/30 uppercase tracking-widest"
          >
            <Download size={18} />
            Save as PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-2",
                activeTab === tab.id 
                  ? `${tab.color} shadow-md scale-105` 
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 md:p-12 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="max-w-none"
            >
              {activeTab === "story" && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-8 border-amber-400 p-8 rounded-r-3xl mb-8">
                    <h3 className="text-amber-800 dark:text-amber-200 text-2xl font-black mb-4 flex items-center gap-2">
                      <Book className="text-amber-500" /> The Big Story 📖
                    </h3>
                    <p className="text-amber-900/80 dark:text-amber-100/80 text-lg leading-relaxed italic">
                      "Imagine you were there... here is what happened in super simple words!"
                    </p>
                  </div>
                  <div className="text-xl leading-relaxed space-y-6 font-medium text-slate-700 dark:text-slate-300">
                    <ReactMarkdown>{result?.story || ""}</ReactMarkdown>
                  </div>
                </div>
              )}

              {activeTab === "context" && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-8 border-blue-400 p-8 rounded-r-3xl mb-8">
                    <h3 className="text-blue-800 dark:text-blue-200 text-2xl font-black mb-4 flex items-center gap-2">
                      <Globe className="text-blue-500" /> The World Back Then 🌍
                    </h3>
                    <p className="text-blue-900/80 dark:text-blue-100/80 text-lg leading-relaxed italic">
                      "What was happening everywhere else? Why did this even start?"
                    </p>
                  </div>
                  <div className="text-xl leading-relaxed space-y-6 font-medium text-slate-700 dark:text-slate-300">
                    <ReactMarkdown>{result?.detailed_context || ""}</ReactMarkdown>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-12">
                  {[
                    { title: "Why it happened?", items: result?.notes?.causes || [], color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-100 dark:border-rose-900/30" },
                    { title: "What happened?", items: result?.notes?.events || [], color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-indigo-100 dark:border-indigo-900/30" },
                    { title: "What changed?", items: result?.notes?.effects || [], color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-100 dark:border-emerald-900/30" },
                    { title: "Cool Facts!", items: result?.notes?.facts || [], color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-100 dark:border-amber-900/30" }
                  ].map((section, i) => (
                    <div key={i}>
                      <h3 className={cn("text-2xl font-black mb-6 flex items-center gap-3", section.color)}>
                        <div className={cn("w-2 h-8 rounded-full", section.color.replace("text", "bg"))} />
                        {section.title}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.length > 0 ? (
                          section.items.map((item, j) => (
                            <li key={j} className={cn("flex gap-4 p-6 rounded-3xl border shadow-sm transition-all hover:scale-[1.02]", section.bg, section.border)}>
                              <CheckCircle2 className={cn("shrink-0 mt-1", section.color)} size={22} />
                              <span className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-snug">{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="col-span-2 p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 italic text-lg">
                            No {section.title.toLowerCase()} found here! 🤷‍♂️
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="relative pl-8 border-l-2 border-indigo-100 dark:border-indigo-900/30 space-y-8 py-4">
                  {(result?.timeline || []).map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-800 shadow-sm" />
                      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold mb-2">{item.year}</span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "people" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Leaders", items: result?.people?.leaders || [], icon: <Users size={20} className="text-indigo-600" /> },
                    { title: "Organizations", items: result?.people?.organizations || [], icon: <Building2 size={20} className="text-violet-600" /> },
                    { title: "Key Terms", items: result?.people?.terms || [], icon: <Book size={20} className="text-fuchsia-600" /> }
                  ].map((section, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.items.map((item, j) => (
                          <li key={j} className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "quiz" && (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Multiple Choice Questions</h3>
                    <div className="space-y-6">
                      {(result?.quiz?.mcqs || []).map((mcq, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <p className="font-bold text-slate-900 dark:text-white mb-4">{i + 1}. {mcq.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {(mcq.options || []).map((opt, j) => (
                              <div key={j} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                {opt}
                              </div>
                            ))}
                          </div>
                          <button 
                            onClick={() => toggleAnswer(i)}
                            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {revealedAnswers[i] ? "Hide Answer" : "Reveal Answer"}
                          </button>
                          {revealedAnswers[i] && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm font-bold"
                            >
                              Correct Answer: {mcq.answer}
                            </motion.p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Short Questions</h3>
                    <div className="space-y-4">
                      {(result?.quiz?.short_questions || []).map((q, i) => (
                        <div key={i} className="flex gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</div>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "revision" && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 md:p-12 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                  <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-6">⚡ Quick Revision Points</h3>
                  <ul className="space-y-4">
                    {(result?.quick_revision || []).map((point, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        <p className="text-lg text-indigo-800 dark:text-indigo-400 font-medium leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1];
      resolve(base64String || "");
    };
    reader.onerror = error => reject(error);
  });
};

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<StudyResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);

    const normalizeResult = (data: any): StudyResult => {
      return {
        story: data.story || "No story generated. 🤷‍♂️",
        detailed_context: data.detailed_context || "No context found. 🌍",
        notes: {
          causes: Array.isArray(data.notes?.causes) ? data.notes.causes : [],
          events: Array.isArray(data.notes?.events) ? data.notes.events : [],
          effects: Array.isArray(data.notes?.effects) ? data.notes.effects : [],
          facts: Array.isArray(data.notes?.facts) ? data.notes.facts : []
        },
        timeline: (Array.isArray(data.timeline) ? data.timeline : []).map((t: any) => ({
          year: t.year || "",
          event: t.event || ""
        })),
        people: {
          leaders: Array.isArray(data.people?.leaders) ? data.people.leaders : [],
          organizations: Array.isArray(data.people?.organizations) ? data.people.organizations : [],
          terms: Array.isArray(data.people?.terms) ? data.people.terms : []
        },
        quiz: {
          mcqs: (Array.isArray(data.quiz?.mcqs) ? data.quiz.mcqs : []).map((m: any) => ({
            question: m.question || "",
            options: Array.isArray(m.options) ? m.options : [],
            answer: m.answer || ""
          })),
          short_questions: Array.isArray(data.quiz?.short_questions) ? data.quiz.short_questions : []
        },
        quick_revision: Array.isArray(data.quick_revision) ? data.quick_revision : []
      };
    };

    const tryProcess = async (modelName: string): Promise<StudyResult> => {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const parts: any[] = [];
      
      const prompt = `You are the world's best teacher for absolute beginners. Your goal is to explain complex history like you are talking to a one-cell organism or a toddler. 

CRITICAL INSTRUCTIONS:
1. EXTREME SIMPLICITY: Use the simplest words possible. No "jargon". No "complex academic terms". If you use a big word, explain it like I'm 5.
2. 10X BETTER DEPTH: Even though the language is simple, the content must be MASSIVE and COMPLETE. Do not skip ANY details from the images.
3. STORY: Tell a long, super-simple, and exciting story (at least 600 words). Use emojis to make it fun! 
4. DETAILED CONTEXT: Explain "What was happening in the world?" in very simple terms.
5. NOTES: Provide TONS of notes (at least 10-15 points per category). Use simple bullet points.
6. QUIZ: Make the questions fun and easy to understand, but challenging enough to test memory.
7. REVISION: Give me "Super Fast Facts" that I can remember in 2 seconds.

RULES:
- Use emojis 🚀 📜 👑 ⚔️ 🌍 to make it visually engaging.
- Break down every complex idea into tiny, bite-sized pieces.
- Be EXHAUSTIVE. I want a giant wall of super-simple information.
- Synthesis multiple pages into one giant, easy-to-read guide.

OUTPUT FORMAT:
Return ONLY valid JSON.
{
"story": "A long, super-simple story with emojis...",
"detailed_context": "The big picture explained simply...",
"notes": {
"causes": ["Simple cause 1", "Simple cause 2", ...],
"events": ["Simple event 1", "Simple event 2", ...],
"effects": ["Simple effect 1", "Simple effect 2", ...],
"facts": ["Simple fact 1", "Simple fact 2", ...]
},
"timeline": [{"year": "...", "event": "..."}],
"people": {
"leaders": [],
"organizations": [],
"terms": []
},
"quiz": {
"mcqs": [{"question": "...", "options": ["...", "...", "...", "..."], "answer": "..."}],
"short_questions": []
},
"quick_revision": []
}`;

      parts.push({ text: prompt });

      const fileParts = await Promise.all(files.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
          inlineData: {
            data: base64Data,
            mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
          }
        };
      }));

      parts.push(...fileParts);

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              story: { type: Type.STRING, description: "A comprehensive narrative of at least 600 words, super simple language." },
              detailed_context: { type: Type.STRING, description: "Deep historical background, explained like a story." },
              notes: {
                type: Type.OBJECT,
                properties: {
                  causes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "At least 10 detailed causes." },
                  events: { type: Type.ARRAY, items: { type: Type.STRING }, description: "At least 10 key events." },
                  effects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "At least 10 long-term effects." },
                  facts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "At least 10 fun facts." }
                }
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    year: { type: Type.STRING },
                    event: { type: Type.STRING }
                  }
                }
              },
              people: {
                type: Type.OBJECT,
                properties: {
                  leaders: { type: Type.ARRAY, items: { type: Type.STRING } },
                  organizations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  terms: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              quiz: {
                type: Type.OBJECT,
                properties: {
                  mcqs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING }
                      }
                    }
                  },
                  short_questions: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              quick_revision: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      // Add a 120-second timeout for the AI response
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out. Please try again.")), 120000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]) as any;

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response from Gemini.");
      }

      let result: StudyResult;
      try {
        result = normalizeResult(JSON.parse(resultText));
      } catch (parseError) {
        console.error("JSON Parse Error:", resultText);
        const cleaned = resultText.replace(/```json|```/g, "").trim();
        result = normalizeResult(JSON.parse(cleaned));
      }
      return result;
    };

    try {
      let result: StudyResult;
      try {
        // Try with Flash first (more reliable for complex tasks)
        result = await tryProcess("gemini-3-flash-preview");
      } catch (flashErr: any) {
        console.warn("Flash model failed, falling back to Lite:", flashErr);
        // If Flash fails, try Lite as a last resort
        result = await tryProcess("gemini-3.1-flash-lite-preview");
      }

      setCurrentResult(result);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: files[0].name.split('.')[0] + (files.length > 1 ? ` + ${files.length - 1} more` : ""),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        result
      };
      setHistory([newItem, ...history]);
      
    } catch (err: any) {
      console.error(err);
      
      // Handle "Requested entity was not found" by prompting for key selection
      if (err.message?.includes("Requested entity was not found") && window.aistudio) {
        setError("API Key issue. Please select a valid API key.");
        await window.aistudio.openSelectKey();
      } else {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard history={history} />} />
          <Route path="/upload" element={<UploadPage onProcess={processFiles} />} />
          <Route 
            path="/processing" 
            element={
              isProcessing ? (
                <ProcessingScreen />
              ) : currentResult ? (
                <OutputPage result={currentResult} />
              ) : error ? (
                <div className="pt-32 text-center px-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl max-w-md mx-auto border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Processing Failed</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                    <Link to="/upload" className="text-indigo-600 font-bold hover:underline">Try again</Link>
                  </div>
                </div>
              ) : (
                <LandingPage />
              )
            } 
          />
          <Route 
            path="/output/:id" 
            element={<OutputWrapper history={history} />} 
          />
        </Routes>

        {/* Error Toast */}
        <AnimatePresence>
          {error && !isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 z-[100] bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError(null)} className="ml-4 hover:opacity-70">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

const OutputWrapper = ({ history }: { history: HistoryItem[] }) => {
  const { id } = useParams<{ id: string }>();
  const item = history.find(h => h.id === id);
  
  if (!item) return <div className="pt-32 text-center text-slate-600 dark:text-slate-400">Study guide not found.</div>;
  return <OutputPage result={item.result} />;
};
