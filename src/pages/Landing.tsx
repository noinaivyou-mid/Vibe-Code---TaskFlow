import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flower2, ArrowRight, CheckCircle2, LayoutGrid, Users, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-navy selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-bold text-2xl">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Flower2 size={38} className="text-yellow-400 fill-yellow-400" />
          </div>
          TaskFlow
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider opacity-60">
            <a href="#features" className="hover:opacity-100 transition-opacity">Features</a>
            <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 border border-[#0a0a0a] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#0a0a0a] hover:text-white transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-88px)] max-w-7xl mx-auto px-6">
        <div className="flex flex-col justify-center py-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[1px] w-12 bg-[#0a0a0a]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Productivity Redefined</span>
            </div>
            <h1 className="text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.88] tracking-tighter mb-8">
              WORK <br />
              SMARTER, <br />
              TOGETHER.
            </h1>
            <p className="text-xl text-[#0a0a0a]/60 max-w-md mb-10 leading-relaxed font-medium">
              The modern project management tool designed for teams who value clarity, speed, and beautiful design.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-[#0a0a0a] uppercase text-[10px] font-bold tracking-widest hover:bg-[#0a0a0a] hover:text-white transition-all"
              >
                <span className="relative z-10">Start <br /> Now</span>
                <motion.div 
                  className="absolute inset-0 bg-[#0a0a0a] rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </button>
              <div className="flex items-center gap-4 px-8 py-4 bg-white border border-[#0a0a0a] rounded-full">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt=""
                    />
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Joined by 2k+ teams</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 w-full max-w-lg aspect-square bg-white border border-[#0a0a0a] p-8 shadow-[40px_40px_0px_rgba(10,10,10,0.05)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#0a0a0a]/10" />
                <div className="w-3 h-3 rounded-full bg-[#0a0a0a]/10" />
                <div className="w-3 h-3 rounded-full bg-[#0a0a0a]/10" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Project Dashboard v2.0</div>
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-[#f5f5f4] rounded-lg w-3/4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-primary rounded-xl" />
                <div className="h-32 bg-[#0a0a0a] rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-[#f5f5f4] rounded w-full" />
                <div className="h-4 bg-[#f5f5f4] rounded w-5/6" />
                <div className="h-4 bg-[#f5f5f4] rounded w-4/6" />
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 p-6 bg-white border border-[#0a0a0a] rounded-2xl shadow-xl"
            >
              <Zap className="text-yellow-400 mb-2" size={24} />
              <div className="text-[10px] font-bold uppercase tracking-widest">Instant Sync</div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-12 p-6 bg-[#0a0a0a] text-white rounded-2xl shadow-xl"
            >
              <Users className="text-white mb-2" size={24} />
              <div className="text-[10px] font-bold uppercase tracking-widest">Team Flow</div>
            </motion.div>
          </motion.div>
          
          {/* Background decorative element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <div className="w-[150%] aspect-square border-[100px] border-[#0a0a0a] rounded-full" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white border-t border-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                icon: LayoutGrid, 
                title: "Visual Kanban", 
                desc: "Organize tasks with a beautiful, intuitive drag-and-drop interface." 
              },
              { 
                icon: Zap, 
                title: "Real-time Sync", 
                desc: "Stay updated with your team instantly. No more refreshing pages." 
              },
              { 
                icon: CheckCircle2, 
                title: "Goal Tracking", 
                desc: "Set milestones and track project progress with detailed analytics." 
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-12 bg-[#f5f5f4] border border-[#0a0a0a] rounded-xl flex items-center justify-center">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-[#0a0a0a]/60 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#0a0a0a]/10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
          © 2026 TaskFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
