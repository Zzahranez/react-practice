import { useState, useEffect, useRef } from "react";

function ParticleField() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${particle.opacity})`;
        ctx.fill();
        
        // Connect nearby particles
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(147, 197, 253, ${0.1 * (100 - distance) / 100})`;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

function QuantumSquare({ value, onSquareClick, isWinning, isEmpty, position }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className={`
        relative w-24 h-24 border-2 transition-all duration-700 ease-out group
        transform-gpu perspective-1000 hover:rotate-x-12 hover:rotate-y-12 hover:-translate-y-4
        ${isEmpty ? 'border-cyan-400/30 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20' : ''}
        ${isWinning ? 'border-emerald-400 bg-gradient-to-br from-emerald-400/30 via-teal-500/30 to-cyan-600/30 animate-pulse' : ''}
        ${value === 'X' ? 'border-cyan-400 bg-gradient-to-br from-cyan-900/40 to-blue-900/40' : ''}
        ${value === 'O' ? 'border-pink-400 bg-gradient-to-br from-pink-900/40 to-purple-900/40' : ''}
        hover:shadow-2xl hover:border-white/50 active:scale-90 cursor-pointer
        overflow-hidden backdrop-blur-sm
      `}
      onClick={onSquareClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: isWinning ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))' : undefined,
        boxShadow: isHovered ? '0 0 40px rgba(147, 197, 253, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)' : undefined
      }}
    >
      {/* Quantum Field Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className={`w-full h-full bg-gradient-to-br animate-spin-slow ${
          isEmpty ? 'from-cyan-500/10 via-purple-500/10 to-pink-500/10' :
          value === 'X' ? 'from-cyan-400/20 to-blue-600/20' : 'from-pink-400/20 to-purple-600/20'
        }`} style={{animationDuration: '8s'}} />
      </div>
      
      {/* Energy Rings */}
      {isHovered && isEmpty && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-2 border border-cyan-400/50 rounded-full animate-ping" />
          <div className="absolute inset-4 border border-purple-400/50 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
          <div className="absolute inset-6 border border-pink-400/50 rounded-full animate-ping" style={{animationDelay: '1s'}} />
        </div>
      )}
      
      {/* Quantum Particles */}
      {value && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-bounce ${
                value === 'X' ? 'bg-cyan-400' : 'bg-pink-400'
              }`}
              style={{
                left: `${20 + Math.sin(i * Math.PI / 4) * 30}%`,
                top: `${20 + Math.cos(i * Math.PI / 4) * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main Symbol */}
      <span className={`
        relative z-10 text-4xl font-bold transition-all duration-500
        ${value === 'X' ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,1)] animate-pulse' : ''}
        ${value === 'O' ? 'text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,1)] animate-pulse' : ''}
        ${value ? 'filter brightness-150 scale-110' : ''}
      `}>
        {value}
      </span>
      
      {/* Holographic Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}

export default function QuantumGalaxyBoard() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameHistory, setGameHistory] = useState({ X: 0, O: 0, draws: 0 });
  const [quantumMode, setQuantumMode] = useState(false);
  const [cosmicEnergy, setCosmicEnergy] = useState(100);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setCosmicEnergy(prev => Math.min(100, prev + 10));
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setCosmicEnergy(100);
  }

  function toggleQuantumMode() {
    if (cosmicEnergy >= 50) {
      setQuantumMode(!quantumMode);
      setCosmicEnergy(prev => prev - 50);
    }
  }

  const { winner, winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  
  useEffect(() => {
    if (winner) {
      setGameHistory(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setCosmicEnergy(100);
    } else if (isDraw) {
      setGameHistory(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [winner, isDraw]);

  let status = "";
  let statusEffect = "";
  
  if (winner) {
    status = ` The Winner Is: ${winner} `;
    statusEffect = "text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-500 bg-clip-text animate-pulse text-3xl font-bold";
  } else if (isDraw) {
    status = "⚡ COSMIC EQUILIBRIUM ⚡";
    statusEffect = "text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-2xl font-bold";
  } else {
    status = `${quantumMode ? '🔮 QUANTUM' : '🚀 PILOT'}: ${xIsNext ? "X" : "O"}`;
    statusEffect = xIsNext 
      ? "text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-2xl font-bold" 
      : "text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-2xl font-bold";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particle Field Background */}
      <ParticleField />
      
      {/* Nebula Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full animate-pulse blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full animate-pulse blur-3xl" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-radial from-pink-500/20 via-transparent to-transparent rounded-full animate-pulse blur-3xl" style={{animationDelay: '4s'}} />
      </div>

      <div className="relative z-10 bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-cyan-400/30 p-8 max-w-lg w-full">
        {/* Cosmic Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text ">
            TIC TAC TOE
          </h1>
          
          {/* Cosmic Energy Bar */}
          <div className="mb-4">
            <div className="text-sm text-cyan-400 mb-2">🔋 Cosmic Energy: {cosmicEnergy}%</div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 animate-pulse"
                style={{width: `${cosmicEnergy}%`}}
              />
            </div>
          </div>
          
          {/* Score with Cosmic Theme */}
          <div className="text-sm space-x-4 mb-4">
            <span className="text-cyan-400 font-bold">🌟 X: {gameHistory.X}</span>
            <span className="text-purple-400">|</span>
            <span className="text-pink-400 font-bold">🔥 O: {gameHistory.O}</span>
            <span className="text-purple-400">|</span>
            <span className="text-yellow-400 font-bold">⚡ Draws: {gameHistory.draws}</span>
          </div>
        </div>
        
        {/* Quantum Status */}
        <div className={`text-center mb-8 ${statusEffect} transition-all duration-500`}>
          {status}
        </div>
        
        {/* Quantum Game Board */}
        <div className="relative mb-8">
          <div className={`grid grid-cols-3 gap-3 p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 ${
            quantumMode 
              ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/50 shadow-[0_0_50px_rgba(168,85,247,0.4)]' 
              : 'bg-gradient-to-br from-gray-900/40 to-blue-900/40 border-cyan-400/30'
          }`}>
            {squares.map((value, index) => (
              <QuantumSquare 
                key={index}
                value={value} 
                onSquareClick={() => handleClick(index)}
                isWinning={winningLine && winningLine.includes(index)}
                isEmpty={!value}
                position={index}
              />
            ))}
          </div>
        </div>
        
        {/* Quantum Controls */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetGame}
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold rounded-full
                       hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 transition-all duration-300
                       transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-cyan-500/50
                       focus:outline-none focus:ring-4 focus:ring-cyan-500/50 overflow-hidden"
            >
              <span className="relative z-10">🚀 New Game</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            
            <button
              onClick={toggleQuantumMode}
              disabled={cosmicEnergy < 50}
              className={`group relative px-6 py-3 font-bold rounded-full transition-all duration-300
                         transform hover:scale-110 active:scale-95 shadow-lg focus:outline-none focus:ring-4 overflow-hidden
                         ${cosmicEnergy >= 50 
                           ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:shadow-purple-500/50 focus:ring-purple-500/50' 
                           : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              <span className="relative z-10">
                {quantumMode ? '🔮 Quantum ON' : '⚡ Quantum Mode'}
              </span>
              {cosmicEnergy >= 50 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </button>
          </div>
          
          <div className="text-center text-xs text-gray-400">
            {quantumMode ? '🔮 Quantum field active - enhanced cosmic powers!' : '⚡ Collect 50 energy to unlock Quantum Mode'}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes gradient-radial { 
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(180deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }

  return { winner: null, winningLine: null };
}