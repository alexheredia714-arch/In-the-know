import React, { useState, useRef } from 'react';
import { User, MapPin, Sparkles, ArrowRight, Camera, ShieldCheck, RotateCcw, Check, RefreshCw, X } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    avatarUrl: ''
  });

  const DEFAULT_AVATAR_PLACEHOLDER = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'User'}&backgroundColor=e2e8f0&fontSize=40`;
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const currentAvatarUrl = formData.avatarUrl || DEFAULT_AVATAR_PLACEHOLDER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: formData.name,
      location: formData.location,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      bio: formData.bio,
      avatarUrl: currentAvatarUrl,
      skills: [],
      stats: {
        jobsPosted: 0,
        jobsCompleted: 0,
        rating: 5.0
      },
      reviews: []
    };

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      if (response.ok) {
        onComplete(newProfile);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">Welcome to KnowApp</h2>
              <p className="text-slate-500 mb-8">Let's build your community reputation. Start by introducing yourself.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Neighborhood</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. North Hills"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Add a profile photo</h2>
              <p className="text-slate-500 mb-8">Personalize your profile so neighbors know who they're talking to.</p>
              
              <div className="flex flex-col items-center gap-6 mb-8">
                {isCameraOpen ? (
                  <div className="relative w-full aspect-square max-w-[240px] rounded-3xl overflow-hidden bg-slate-900 border-4 border-emerald-500 shadow-xl">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover -scale-x-100"
                      />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                        <button 
                            type="button"
                            onClick={capturePhoto}
                            className="bg-white p-4 rounded-full shadow-lg text-emerald-600 hover:scale-110 active:scale-95 transition-all"
                        >
                            <Camera className="w-6 h-6" />
                        </button>
                        <button 
                            type="button"
                            onClick={stopCamera}
                            className="bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg text-white hover:bg-white/30 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                      </div>
                  </div>
                ) : capturedImage ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-emerald-500 bg-slate-100 shadow-xl">
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-3 w-full max-w-[200px]">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, avatarUrl: capturedImage})}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                formData.avatarUrl === capturedImage ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                            <Check className="w-4 h-4" />
                            Use Real Photo
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                // Stylize the captured photo by applying a specific dicebear style (or keeping the concept with seed)
                                const stylizedSeed = `stylized_${formData.name}_${Math.random().toString(36).substring(7)}`;
                                setFormData({...formData, avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${stylizedSeed}`});
                            }}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                formData.avatarUrl.includes('dicebear') && formData.avatarUrl.includes('pixel-art') ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Stylized Avatar
                        </button>
                        <button 
                            type="button"
                            onClick={startCamera}
                            className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-700 mt-2"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Retake Photo
                        </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-200 bg-slate-100 flex items-center justify-center shadow-inner">
                        {formData.avatarUrl ? (
                            <img src={currentAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-slate-300">
                                <User className="w-12 h-12 mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                            </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 w-full gap-3 px-8">
                        <button 
                            type="button"
                            onClick={startCamera}
                            className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg group"
                        >
                            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Take a Selfie
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest pt-2"
                        >
                            Skip / Use Default
                        </button>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell your story</h2>
              <p className="text-slate-500 mb-8">What are you good at? What do you need help with?</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Bio</label>
                  <textarea 
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="e.g. Handy with a wrench, terrible with a paintbrush. Always looking to trade plumbing work for gardening help!"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            {step === 3 ? 'Create My Profile' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
