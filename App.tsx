import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { 
  Settings2, 
  Sparkles, 
  Heart, 
  TreePine, 
  Cat, 
  Box, 
  Circle,
  Tornado,
  Palette,
  MousePointer2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import ParticleSystem from './components/Scene';
import { ParticleConfig, ShapeType } from './types';

const App: React.FC = () => {
  const [isUIOpen, setIsUIOpen] = useState(true);
  const [config, setConfig] = useState<ParticleConfig>({
    count: 25000,
    shape: 'heart',
    colorA: '#ff0066',
    colorB: '#5500ff',
    particleSize: 0.05,
    speed: 0.5,
    noiseStrength: 0.5,
    hoverEffect: true,
  });

  // Presets for quick switching
  const applyPreset = (type: 'love' | 'xmas' | 'cyber' | 'nature') => {
    switch(type) {
      case 'love':
        // High density solid heart
        setConfig(prev => ({ 
          ...prev, 
          shape: 'heart', 
          colorA: '#ff0a54', 
          colorB: '#ff477e', 
          noiseStrength: 0.3,
          count: 40000 
        }));
        break;
      case 'xmas':
        setConfig(prev => ({ 
          ...prev, 
          shape: 'tree', 
          colorA: '#00ff87', 
          colorB: '#60efff', 
          noiseStrength: 0.4,
          count: 25000
        }));
        break;
      case 'cyber':
        setConfig(prev => ({ 
          ...prev, 
          shape: 'cube', 
          colorA: '#00f260', 
          colorB: '#0575E6', 
          noiseStrength: 0.8,
          count: 20000 
        }));
        break;
      case 'nature':
        setConfig(prev => ({ 
          ...prev, 
          shape: 'spiral', 
          colorA: '#f7ff00', 
          colorB: '#db36a4', 
          noiseStrength: 0.6,
          count: 15000 
        }));
        break;
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
          <color attach="background" args={['#050505']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color={config.colorA} />
          <pointLight position={[-10, -10, -10]} intensity={1} color={config.colorB} />
          
          <Suspense fallback={null}>
            <ParticleSystem config={config} />
          </Suspense>
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={5} 
            maxDistance={25} 
            autoRotate={!config.hoverEffect} 
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start">
        <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-lg tracking-tight font-['Outfit']">
            PARTICLE DREAMS
            </h1>
            <p className="text-white/60 text-sm md:text-base mt-2 font-light">
            Interactive 3D Generative Art System
            </p>
        </div>
      </div>

      {/* Toggle UI Button */}
      <button 
        onClick={() => setIsUIOpen(!isUIOpen)}
        className="absolute bottom-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all shadow-lg hover:shadow-cyan-500/30"
      >
        {isUIOpen ? <Minimize2 size={24} /> : <Settings2 size={24} />}
      </button>

      {/* Control Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full md:w-96 bg-black/40 backdrop-blur-xl border-l border-white/10 z-40 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          isUIOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-2 text-white/90 border-b border-white/10 pb-4">
                <Sparkles className="text-cyan-400" />
                <span className="font-bold text-lg">System Configuration</span>
            </div>

            {/* Shape Selector */}
            <div className="space-y-4">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Target Morphology</label>
                <div className="grid grid-cols-3 gap-3">
                    <ShapeButton 
                        active={config.shape === 'heart'} 
                        onClick={() => setConfig({...config, shape: 'heart'})} 
                        icon={<Heart size={18} />} 
                        label="Heart" 
                    />
                    <ShapeButton 
                        active={config.shape === 'tree'} 
                        onClick={() => setConfig({...config, shape: 'tree'})} 
                        icon={<TreePine size={18} />} 
                        label="Tree" 
                    />
                    <ShapeButton 
                        active={config.shape === 'cat'} 
                        onClick={() => setConfig({...config, shape: 'cat'})} 
                        icon={<Cat size={18} />} 
                        label="Cat" 
                    />
                    <ShapeButton 
                        active={config.shape === 'sphere'} 
                        onClick={() => setConfig({...config, shape: 'sphere'})} 
                        icon={<Circle size={18} />} 
                        label="Sphere" 
                    />
                    <ShapeButton 
                        active={config.shape === 'cube'} 
                        onClick={() => setConfig({...config, shape: 'cube'})} 
                        icon={<Box size={18} />} 
                        label="Cube" 
                    />
                    <ShapeButton 
                        active={config.shape === 'spiral'} 
                        onClick={() => setConfig({...config, shape: 'spiral'})} 
                        icon={<Tornado size={18} />} 
                        label="Spiral" 
                    />
                </div>
            </div>

            {/* Physics Controls */}
            <div className="space-y-6">
                 <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Physics & Simulation</label>
                 
                 {/* Count */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                        <span>Particle Density</span>
                        <span>{config.count.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="1000" max="60000" step="1000"
                        value={config.count}
                        onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/40 accent-cyan-400"
                    />
                 </div>

                 {/* Speed */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                        <span>Response Speed</span>
                        <span>{(config.speed * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                        type="range" min="0.01" max="1" step="0.01"
                        value={config.speed}
                        onChange={(e) => setConfig({...config, speed: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                 </div>

                 {/* Noise */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                        <span>Entropy / Noise</span>
                        <span>{(config.noiseStrength * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="2" step="0.1"
                        value={config.noiseStrength}
                        onChange={(e) => setConfig({...config, noiseStrength: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                 </div>
            </div>

            {/* Appearance */}
            <div className="space-y-6">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Visual Aesthetics</label>
                
                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <span className="text-xs text-white/60">Primary</span>
                        <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                            <input 
                                type="color" 
                                value={config.colorA}
                                onChange={(e) => setConfig({...config, colorA: e.target.value})}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="ml-2 text-xs text-white/80 font-mono">{config.colorA}</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <span className="text-xs text-white/60">Secondary</span>
                        <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                            <input 
                                type="color" 
                                value={config.colorB}
                                onChange={(e) => setConfig({...config, colorB: e.target.value})}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                            />
                            <span className="ml-2 text-xs text-white/80 font-mono">{config.colorB}</span>
                        </div>
                    </div>
                </div>

                {/* Particle Size */}
                <div className="space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                        <span>Particle Size</span>
                        <span>{config.particleSize}</span>
                    </div>
                    <input 
                        type="range" min="0.01" max="0.2" step="0.01"
                        value={config.particleSize}
                        onChange={(e) => setConfig({...config, particleSize: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                 </div>
            </div>

            {/* Interaction */}
             <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MousePointer2 size={18} className="text-cyan-400" />
                        <span className="text-sm font-medium text-white/90">Cursor Repulsion</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={config.hoverEffect} 
                            onChange={(e) => setConfig({...config, hoverEffect: e.target.checked})}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <button onClick={() => applyPreset('love')} className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/30 rounded text-xs font-bold text-pink-300 transition-colors">
                    PRESET: LOVE
                </button>
                <button onClick={() => applyPreset('xmas')} className="px-4 py-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 rounded text-xs font-bold text-green-300 transition-colors">
                    PRESET: XMAS
                </button>
                <button onClick={() => applyPreset('cyber')} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded text-xs font-bold text-blue-300 transition-colors">
                    PRESET: CYBER
                </button>
                <button onClick={() => applyPreset('nature')} className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/30 rounded text-xs font-bold text-yellow-300 transition-colors">
                    PRESET: VIBE
                </button>
            </div>
            
            <div className="text-center pt-8 pb-4">
                 <p className="text-xs text-white/30">Created by Senior Frontend Engineer</p>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper UI Component
const ShapeButton: React.FC<{
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string
}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
            active 
            ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
        <div className={`mb-1 transition-colors ${active ? 'text-cyan-400' : 'text-white/60 group-hover:text-white'}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? 'text-white' : 'text-white/40'}`}>
            {label}
        </span>
    </button>
);

export default App;