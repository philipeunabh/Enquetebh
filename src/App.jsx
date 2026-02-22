import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BarChart3, 
  LogOut, 
  Vote, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Menu,
  X,
  User as UserIcon,
  Home as HomeIcon,
  Share2,
  Link as LinkIcon,
  Copy,
  Twitter,
  Sparkles,
  Loader2,
  Code,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';





const Navbar = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <Vote className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-serif italic font-bold tracking-tight">Enquetes BH</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">Início</button>
            <button onClick={() => onNavigate('polls')} className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">Enquetes</button>
            <div className="relative">
              <button 
                onClick={() => setShowCategories(!showCategories)}
                onBlur={() => setTimeout(() => setShowCategories(false), 100)}
                className="text-stone-600 hover:text-emerald-600 font-medium transition-colors flex items-center"
              >
                Categorias <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <AnimatePresence>
                {showCategories && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-100 py-1 z-50"
                  >
                    {categories.map(cat => (
                      <a href={`/category/${cat}`} key={cat} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">{cat}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  onBlur={() => setTimeout(() => setShowAccountMenu(false), 100)}
                  className="flex items-center space-x-2 text-stone-700 hover:text-emerald-600"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Minha Conta</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-100 py-1 z-50"
                    >
                      <button onClick={() => onNavigate('profile')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Meu Perfil</button>
                      {user.role === 'admin' && <button onClick={() => onNavigate('admin')} className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">Painel Admin</button>}
                      <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sair</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all shadow-sm"
              >
                Entrar
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md">Início</button>
              <button onClick={() => { onNavigate('polls'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md">Enquetes</button>
              {user?.role === 'admin' && (
                <button onClick={() => { onNavigate('admin'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-600 hover:bg-stone-50 rounded-md">Painel Admin</button>
              )}
              {user ? (
                <button onClick={onLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">Sair</button>
              ) : (
                <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-emerald-600 font-medium">Entrar</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoginPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      onLogin(data.user);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-stone-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Bem-vindo de volta</h2>
          <p className="text-stone-500 mt-2">Acesse sua conta para votar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-500">
          Não tem uma conta? <button onClick={() => onNavigate('register')} className="text-emerald-600 font-bold hover:underline">Cadastre-se</button>
        </div>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      onLogin(data.user);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-stone-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Crie sua conta</h2>
          <p className="text-stone-500 mt-2">Participe das decisões de BH</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="João Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-500">
          Já tem uma conta? <button onClick={() => onNavigate('login')} className="text-emerald-600 font-bold hover:underline">Entre aqui</button>
        </div>
      </motion.div>
    </div>
  );
};

const HomePage = ({ onNavigate }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 9;

  const fetchPolls = (currentOffset) => {
    setLoading(true);
    fetch(`/api/polls?limit=${limit}&offset=${currentOffset}`)
      .then(res => res.json())
      .then(data => {
        setPolls(prev => {
          const allPolls = [...prev, ...data.polls];
          const uniquePolls = Array.from(new Map(allPolls.map(p => [p.id, p])).values());
          return uniquePolls;
        });
        setHasMore(data.polls.length === limit);
        setOffset(currentOffset + limit);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPolls(0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-tight"
        >
          Sua voz, <br />
          <span className="text-emerald-600 italic">nossa cidade.</span>
        </motion.h1>
        <p className="mt-6 text-xl text-stone-500 max-w-2xl mx-auto">
          Participe das enquetes mais relevantes sobre Belo Horizonte e ajude a construir o futuro da capital mineira.
        </p>
      </header>

      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Enquetes em Destaque</h2>
            <div className="h-1 w-12 bg-emerald-500 mt-2"></div>
          </div>
          <button onClick={() => onNavigate('polls')} className="text-emerald-600 font-bold flex items-center hover:gap-2 transition-all">
            Ver todas <ChevronRight className="h-4 w-4" />
          </button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {polls.map((poll, index) => (
              <motion.div 
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onNavigate('poll-detail', poll.id)}
                className="group bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    poll.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {poll.status === 'active' ? 'Ativa' : 'Encerrada'}
                  </span>
                  <div className="flex items-center text-stone-400 text-sm">
                    <Vote className="h-4 w-4 mr-1" />
                    {poll.total_votes} votos
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors mb-2">
                  {poll.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-6">
                  {poll.description}
                </p>
                <div className="flex items-center text-emerald-600 font-bold text-sm">
                  Votar agora <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <button 
              onClick={() => fetchPolls(offset)}
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md disabled:bg-stone-400"
            >
              {loading ? 'Carregando...' : 'Carregar Mais Enquetes'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const PollResults = ({ pollId, pollTitle, pollDescription }) => {
  const [data, setData] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/polls/${pollId}/results`).then(res => res.json()).then(setData);
  }, [pollId]);

  const generateAIInsight = async () => {
    if (!data) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const resultsStr = data.results.map(r => `${r.label}: ${r.votes} votos`).join(', ');
      const prompt = `Analise os resultados desta enquete de Belo Horizonte:
      Título: ${pollTitle}
      Descrição: ${pollDescription}
      Resultados: ${resultsStr}
      Total de votos: ${data.totalVotes}
      
      Forneça um insight curto (máximo 3 frases) sobre o que esses números sugerem sobre a opinião dos cidadãos de BH. Seja direto e use um tom profissional.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      setAiInsight(response.text || "Não foi possível gerar uma análise no momento.");
    } catch (error) {
      console.error("Erro ao chamar Gemini API:", error);
      setAiInsight("Erro ao conectar com a inteligência artificial.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data) return <div className="text-center p-8">Carregando resultados...</div>;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-stone-50 border border-stone-100 p-8 rounded-2xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-1">Resultados</h2>
          <p className="text-stone-500">Total de <span className="font-bold text-stone-700">{data.totalVotes}</span> votos computados.</p>
        </div>
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mt-4 md:mt-0" />
      </div>
      
      <div className="space-y-4 mb-8">
        {data.results.map((item, index) => (
          <div key={item.id} className="overflow-hidden rounded-lg">
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="text-sm font-bold text-stone-700">{item.label}</span>
              <span className="text-sm font-bold text-stone-600">
                {item.votes} votos ({data.totalVotes > 0 ? ((item.votes / data.totalVotes) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-4">
              <motion.div 
                className="h-4 rounded-full"
                style={{ background: COLORS[index % COLORS.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${data.totalVotes > 0 ? (item.votes / data.totalVotes) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-stone-200">
        {!aiInsight ? (
          <button 
            onClick={generateAIInsight}
            disabled={isGenerating}
            className="flex items-center space-x-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analisando dados...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Gerar Insight com IA</span>
              </>
            )}
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"
          >
            <div className="flex items-center space-x-2 text-emerald-700 font-bold mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Análise da IA</span>
            </div>
            <p className="text-sm text-stone-700 italic leading-relaxed">
              "{aiInsight}"
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const ShareModal = ({ poll, onClose }) => {
  const [copied, setCopied] = useState(false);
  const pollUrl = window.location.href;
  const shareText = `Participe da enquete: \"${poll.title}\" em Enquetes BH!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pollUrl)}&text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pollUrl)}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4"><X className="h-6 w-6 text-stone-400" /></button>
        <div className="text-center">
          <Share2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-900">Compartilhe</h2>
          <p className="text-stone-500 mt-2 mb-6">Ajude a divulgar esta enquete e traga mais vozes para a discussão.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-2 border border-stone-200 rounded-lg">
            <LinkIcon className="h-5 w-5 text-stone-400 flex-shrink-0" />
            <input type="text" readOnly value={pollUrl} className="flex-grow bg-transparent outline-none text-sm text-stone-600" />
            <button onClick={handleCopy} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-bold">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
            </a>
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PollDetailPage = ({ pollId, user, onNavigate }) => {
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const url = user ? `/api/polls/${pollId}?userId=${user.id}` : `/api/polls/${pollId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPoll(data);
        if (data.userVoted) {
          setVoted(true);
        }
        setLoading(false);
      });
  }, [pollId, user]);

  const handleVote = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (!selectedOption) return;

    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId: selectedOption, userId: user.id })
    });
    const data = await res.json();
    if (data.success) {
      setVoted(true);
    } else {
      setError(data.message);
      if (data.message.includes('já votou')) {
        setVoted(true);
      }
    }
  };

  if (loading) return <div className="p-12 text-center">Carregando...</div>;
  if (!poll) return <div className="p-12 text-center">Enquete não encontrada.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 relative"
      >
        <button 
          onClick={() => setShowShareModal(true)}
          className="absolute top-4 right-4 z-10 p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all backdrop-blur-sm"
        >
          <Share2 className="h-5 w-5" />
        </button>

        <div className="bg-emerald-600 p-8 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase">Enquete Oficial</span>
            <span className="text-white/60 text-xs">• BH em Foco</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">{poll.title}</h1>
        </div>

        <div className="p-8">
          <p className="text-stone-600 text-lg mb-8 leading-relaxed">
            {poll.description}
          </p>

          {voted ? (
            <PollResults pollId={poll.id} pollTitle={poll.title} pollDescription={poll.description} />
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="grid gap-4">
                {poll.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedOption === option.id 
                        ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10' 
                        : 'border-stone-100 hover:border-stone-200 bg-stone-50'
                    }`}
                  >
                    <span className={`font-bold ${selectedOption === option.id ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {option.label}
                    </span>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option.id ? 'border-emerald-500 bg-emerald-500' : 'border-stone-300'
                    }`}>
                      {selectedOption === option.id && <div className="h-2 w-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-stone-100">
                <button
                  disabled={!selectedOption}
                  onClick={handleVote}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                    selectedOption 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar Voto
                </button>
                <p className="text-center text-stone-400 text-xs mt-4">
                  Ao votar, você concorda com nossos Termos de Uso e Privacidade.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      {showShareModal && poll && <ShareModal poll={poll} onClose={() => setShowShareModal(false)} />}
    </div>
  );
};

const EmbedModal = ({ poll, onClose }) => {
  const [copied, setCopied] = useState(false);
  const embedCode = `<div id="enquetes-bh-embed-${poll.id}"></div>\n<script src="${window.location.origin}/embed.js?pollId=${poll.id}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4"><X className="h-6 w-6 text-stone-400" /></button>
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Code className="h-6 w-6" /></div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Incorporar Enquete</h2>
            <p className="text-stone-500">Copie e cole este código no seu site.</p>
          </div>
        </div>
        <textarea 
          readOnly
          className="w-full h-40 p-4 font-mono text-sm bg-stone-100 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={embedCode}
        />
        <button 
          onClick={handleCopy}
          className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md"
        >
          {copied ? 'Copiado!' : 'Copiar Código'}
        </button>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(null);
  const [settings, setSettings] = useState({ adsense_client_id: '', adsense_slot_id_list: '', adsense_slot_id_results: '' });
  const [expandedReports, setExpandedReports] = useState(new Set());

  const toggleReport = (pollId) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pollId)) {
        newSet.delete(pollId);
      } else {
        newSet.add(pollId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
    fetch('/api/admin/polls').then(res => res.json()).then(setPolls);
    fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
  }, []);

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSettingsSave = async () => {
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('Configurações salvas!');
  };



  const CreatePollModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleAddOption = () => setOptions([...options, '']);
    const handleOptionChange = (index, val) => {
      const newOpts = [...options];
      newOpts[index] = val;
      setOptions(newOpts);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await fetch('/api/admin/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, type: 'single', status: 'active', options: options.filter(o => o.trim()) })
      });
      if (res.ok) {
        setShowCreateModal(false);
        // Refresh
        fetch('/api/admin/polls').then(res => res.json()).then(setPolls);
      }
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Nova Enquete</h2>
            <button onClick={() => setShowCreateModal(false)}><X className="h-6 w-6 text-stone-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Título / Pergunta</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Categoria</label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ex: Política, Esportes, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Opções</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <input 
                    key={i}
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={`Opção ${i + 1}`}
                  />
                ))}
                <button 
                  type="button"
                  onClick={handleAddOption}
                  className="text-emerald-600 font-bold text-sm flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Opção
                </button>
              </div>
            </div>
            <div className="pt-4 flex space-x-4">
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md"
              >
                Criar Enquete
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const PollReport = ({ pollId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch(`/api/admin/polls/${pollId}/report`).then(res => res.json()).then(setData);
    }, [pollId]);

    if (!data) return <div>Carregando relatório...</div>;

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className="space-y-8 mt-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h3 className="text-lg font-bold mb-6 text-stone-800">Distribuição de Votos</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.options}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="votes"
                    nameKey="label"
                  >
                    {data.options.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <h3 className="text-lg font-bold mb-6 text-stone-800">Votos por Opção</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.options}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="votes" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold mb-6 text-stone-800">Evolução dos Votos</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Painel Administrativo</h1>
          <p className="text-stone-500">Gestão de plataforma e relatórios</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:bg-emerald-700 transition-all"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Nova Enquete
        </button>
      </div>

      <div className="flex space-x-1 bg-stone-100 p-1 rounded-xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('polls')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'polls' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Enquetes
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Configurações
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
                <span className="text-xs font-bold text-stone-400 uppercase">Usuários</span>
              </div>
              <div className="text-3xl font-bold text-stone-900">{stats?.totalUsers}</div>
              <div className="text-sm text-stone-500 mt-1">Total cadastrado</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Vote className="h-6 w-6" /></div>
                <span className="text-xs font-bold text-stone-400 uppercase">Enquetes</span>
              </div>
              <div className="text-3xl font-bold text-stone-900">{stats?.totalPolls}</div>
              <div className="text-sm text-stone-500 mt-1">{stats?.activePolls} ativas agora</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><CheckCircle2 className="h-6 w-6" /></div>
                <span className="text-xs font-bold text-stone-400 uppercase">Votos</span>
              </div>
              <div className="text-3xl font-bold text-stone-900">{stats?.totalVotes}</div>
              <div className="text-sm text-stone-500 mt-1">Participação total</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 className="h-6 w-6" /></div>
                <span className="text-xs font-bold text-stone-400 uppercase">Conversão</span>
              </div>
              <div className="text-3xl font-bold text-stone-900">
                {stats && stats.totalUsers > 0 ? ((stats.totalVotes / stats.totalUsers) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-stone-500 mt-1">Votos por usuário</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'polls' && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Título</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Votos</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {polls.map((poll) => (
                <React.Fragment key={poll.id}>
                  <tr className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-stone-900">{poll.title}</div>
                      <div className="text-xs text-stone-400 truncate max-w-xs">{poll.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        poll.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {poll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 font-medium">
                      {poll.total_votes || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setShowEmbedModal(poll)}
                          className="p-2 text-stone-400 hover:text-emerald-600"
                          title="Incorporar Enquete"
                        >
                          <Code className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleReport(poll.id)}
                          className="p-2 text-stone-400 hover:text-emerald-600 flex items-center"
                          title="Ver Relatório"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expandedReports.has(poll.id) ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="p-0">
                      <AnimatePresence>
                        {expandedReports.has(poll.id) && (
                          <motion.div
                            key={`report-anim-${poll.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-stone-50"
                          >
                            <div className="px-6 py-4 border-t border-stone-200">
                              <PollReport pollId={poll.id} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Configurações de Anúncios</h2>
          <p className="text-stone-500 mb-6">Insira seus códigos do Google AdSense. Deixe em branco para desativar.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">AdSense Client ID</label>
              <input 
                type="text" 
                name="adsense_client_id"
                value={settings.adsense_client_id}
                onChange={handleSettingsChange}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slot ID (Listagem de Enquetes)</label>
              <input 
                type="text" 
                name="adsense_slot_id_list"
                value={settings.adsense_slot_id_list}
                onChange={handleSettingsChange}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slot ID (Página de Resultados)</label>
              <input 
                type="text" 
                name="adsense_slot_id_results"
                value={settings.adsense_slot_id_results}
                onChange={handleSettingsChange}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
          <div className="mt-6 border-t border-stone-100 pt-6">
            <button 
              onClick={handleSettingsSave}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      )}

      {showCreateModal && <CreatePollModal />}
      {showEmbedModal && <EmbedModal poll={showEmbedModal} onClose={() => setShowEmbedModal(null)} />}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPollId, setCurrentPollId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const navigate = (page, id) => {
    setCurrentPage(page);
    if (id) setCurrentPollId(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onNavigate={navigate} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (currentPollId || '')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === 'home' && <HomePage onNavigate={navigate} />}
              {currentPage === 'polls' && <HomePage onNavigate={navigate} />}
              {currentPage === 'poll-detail' && currentPollId && (
                <PollDetailPage pollId={currentPollId} user={user} onNavigate={navigate} />
              )}
              {currentPage === 'login' && <LoginPage onLogin={handleLogin} onNavigate={navigate} />}
              {currentPage === 'register' && <RegisterPage onLogin={handleLogin} onNavigate={navigate} />}
              {currentPage === 'admin' && user?.role === 'admin' && <AdminDashboard />}
              {currentPage === 'profile' && user && <UserProfilePage user={user} />}
            </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center text-white mb-6">
                <Vote className="h-6 w-6 text-emerald-500" />
                <span className="ml-2 text-xl font-serif italic font-bold">Enquetes BH</span>
              </div>
              <p className="text-sm leading-relaxed">
                Plataforma independente de participação cidadã em Belo Horizonte. Sua opinião ajuda a moldar o futuro da nossa capital.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Links Rápidos</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Início</button></li>
                <li><button onClick={() => navigate('polls')} className="hover:text-white transition-colors">Todas as Enquetes</button></li>
                <li><button className="hover:text-white transition-colors">Termos de Uso</button></li>
                <li><button className="hover:text-white transition-colors">Privacidade</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contato</h4>
              <p className="text-sm mb-4">Dúvidas ou sugestões? Entre em contato conosco.</p>
              <a href="mailto:contato@enquetesbh.com.br" className="text-emerald-500 font-bold hover:underline">contato@enquetesbh.com.br</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs">
            &copy; {new Date().getFullYear()} Enquetes BH. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

const UserProfilePage = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${user.id}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-stone-900">Meu Histórico</h1>
        <p className="text-stone-500 mt-2">Aqui estão todas as enquetes que você já participou.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Carregando seu histórico...</div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-stone-500">Você ainda não votou em nenhuma enquete.</div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {history.map((item) => (
              <li key={`${item.poll_title}-${item.voted_at}`} className="p-6 hover:bg-stone-50 transition-colors">
                <p className="text-xs text-stone-400 mb-1">
                  {new Date(item.voted_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="font-bold text-stone-800 mb-2">{item.poll_title}</h3>
                <p className="text-sm text-stone-600">
                  Sua resposta: <span className="font-bold text-emerald-600">{item.chosen_option}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};