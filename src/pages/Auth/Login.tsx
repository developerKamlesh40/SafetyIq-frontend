import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth.service';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      setAuth(result.token, result.user);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      {/* LEFT SIDE - Mission */}
      <div className="hidden lg:flex w-1/2 relative bg-black flex-col p-12 overflow-y-auto">
        {/* Background Image with Overlay */}
        <div className="fixed top-0 left-0 w-1/2 h-screen z-0 bg-[#020810] pointer-events-none">
          <img 
            src="/images/miner-face.png" 
            alt="Miner" 
            className="w-full h-full object-cover opacity-80 mix-blend-lighten" 
          />
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-full">
          {/* Top Badge */}
          <div className="flex items-center space-x-2 mt-4 mb-20 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            <div className="w-1.5 h-1.5 bg-safety-cyan transform rotate-45"></div>
            <span>A Mission, Not A Product</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
            Every life is <br />
            <span className="text-safety-cyan font-semibold">worth protecting.</span>
          </h1>

          {/* Text Content */}
          <div className="space-y-6 text-gray-300 max-w-[480px] mb-12">
            <p className="leading-relaxed text-sm">
              India's heavy industrial sector recorded <span className="text-safety-amber font-semibold">6,500+ fatal workplace accidents in FY2023</span> (DGFASLI). Behind every number is a family waiting at home — a lunch left uneaten, a child's question unanswered.
            </p>
            <p className="leading-relaxed text-sm">
              SafetyIQ fuses IoT sensors, SCADA, permits, maintenance logs, worker tracking, CCTV events, weather and equipment telemetry — to predict accidents <span className="text-white font-medium">before</span> they happen.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-16 max-w-[500px]">
            <div className="bg-[#0A1A22]/60 border border-white/5 rounded-xl p-4 backdrop-blur-md">
              <div className="text-safety-amber font-bold text-lg mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                6,500+
              </div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Lives lost / year</div>
            </div>
            <div className="bg-[#0A1A22]/60 border border-white/5 rounded-xl p-4 backdrop-blur-md">
              <div className="text-safety-cyan font-bold text-lg mb-1 flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                8 streams
              </div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Fused in realtime</div>
            </div>
            <div className="bg-[#0A1A22]/60 border border-white/5 rounded-xl p-4 backdrop-blur-md">
              <div className="text-safety-cyan font-bold text-lg mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Predict
              </div>
              <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Not report</div>
            </div>
          </div>

          {/* Bottom Footer Images Area */}
          <div className="mt-auto flex items-center space-x-6">
            <div className="flex space-x-2">
              <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/images/construction-sunset.png" alt="Construction" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-safety-amber/10 mix-blend-overlay"></div>
              </div>
              <div className="w-24 h-16 rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/images/iot-network.png" alt="IoT Network" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-safety-cyan/20 mix-blend-overlay"></div>
              </div>
            </div>
            <p className="text-xs text-gray-400 max-w-[220px] leading-relaxed">
              From the mine face to the scaffold —<br/>every sensor, every second, watching over them.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex items-center justify-center bg-gradient-to-br from-[#06151A] via-[#040C0F] to-[#020608] p-8 relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-safety-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-[420px] relative z-10">
          {/* Login Content */}
          <div className="w-full relative">
            {/* Header integrated into the box */}
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#04080b] border border-white/5 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                <Shield className="w-8 h-8 text-safety-cyan" />
              </div>
              <h2 className="text-3xl font-serif text-white tracking-wide mb-1.5">SafetyIQ</h2>
              <p className="text-gray-400 text-xs tracking-widest uppercase font-medium">AI-Powered Safety Intelligence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-safety-red/10 border border-safety-red/20 text-sm text-safety-red text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase ml-1 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#eef4f9] border-none rounded-xl px-4 py-4 text-[15px] font-medium text-[#0a1a22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-safety-cyan transition-all"
                  placeholder="gauravtiwari@gmail.com"
                  required
                />
              </div>

              <div className="space-y-1.5 mt-2">
                <label className="block text-xs font-bold text-gray-400 tracking-widest uppercase ml-1 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#eef4f9] border-none rounded-xl px-4 py-4 pr-12 text-[15px] font-medium text-[#0a1a22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-safety-cyan transition-all tracking-widest"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 bg-[#00d4ff] text-black text-[17px] font-bold rounded-xl hover:bg-[#00e0ff] transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>
              </div>

              {/* Demo Box */}
              <div className="mt-10 p-6 rounded-2xl bg-[#080d12] border border-white/5 relative">
                <div className="text-center text-xs font-bold text-gray-500 tracking-widest uppercase mb-6">Demo Access</div>
                <div className="flex flex-col gap-5 text-[15px] relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white tracking-wide">admin</span>
                    <span className="font-mono font-medium text-safety-cyan">SafetyIQ@2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white tracking-wide">safety_officer</span>
                    <span className="font-mono font-medium text-safety-cyan">Safety@123</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-[10px] font-medium text-gray-600 tracking-widest uppercase">
              Protecting India's workforce • Made with purpose
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
