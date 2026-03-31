import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flower2, Mail, Lock, ArrowRight, Github, Chrome, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      login();
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#0a0a0a] p-10 shadow-[20px_20px_0px_rgba(10,10,10,0.05)]"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-14 h-14 flex items-center justify-center mb-4">
            <Flower2 size={56} className="text-yellow-400 fill-yellow-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smile size={24} className="text-[#0a0a0a] fill-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">Welcome Back</h2>
          <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mt-2">Enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a0a0a]/20" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#f5f5f4] border border-transparent focus:border-[#0a0a0a] focus:bg-white transition-all outline-none rounded-xl text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Password</label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0a0a0a]/20" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#f5f5f4] border border-transparent focus:border-[#0a0a0a] focus:bg-white transition-all outline-none rounded-xl text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#0a0a0a] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#0a0a0a]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#0a0a0a]/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-white px-4 opacity-40">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-3 border border-[#0a0a0a]/10 rounded-xl hover:bg-[#f5f5f4] transition-all text-xs font-bold uppercase tracking-widest">
            <Github size={18} />
            Github
          </button>
          <button className="flex items-center justify-center gap-3 py-3 border border-[#0a0a0a]/10 rounded-xl hover:bg-[#f5f5f4] transition-all text-xs font-bold uppercase tracking-widest">
            <Chrome size={18} />
            Google
          </button>
        </div>

        <p className="mt-10 text-center text-xs font-medium text-[#0a0a0a]/40">
          Don't have an account? <button className="font-bold text-[#0a0a0a] hover:underline">Create one</button>
        </p>
      </motion.div>

      <button 
        onClick={() => navigate('/')}
        className="mt-8 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
      >
        ← Back to Home
      </button>
    </div>
  );
};
