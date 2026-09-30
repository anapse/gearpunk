import React from 'react';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { soundManager } from '../game/audio/soundManager';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl w-full max-w-[380px] flex flex-col shadow-2xl overflow-hidden text-stone-200">
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black font-chakra text-amber-400 uppercase tracking-wider">
              CONTÁCTANOS
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onClose();
            }}
            className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30">
              <MessageSquare className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-chakra text-white">¿Quieres colaborar?</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Si tienes ideas para nuevos niveles, mecánicas o simplemente quieres ser parte del equipo de <strong>Gear Rush</strong>, escríbenos a:
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl flex items-center justify-center gap-3 group hover:border-amber-500/50 transition-colors">
            <span className="text-amber-400 font-mono font-bold select-all">anapse_video@hotmail.com</span>
          </div>

          <a 
            href="mailto:anapse_video@hotmail.com"
            onClick={() => soundManager.playButtonClick()}
            className="gear-btn gear-btn-green w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-black font-chakra tracking-wide"
          >
            <Send className="w-4 h-4" />
            <span>ENVIAR CORREO</span>
          </a>
        </div>

        {/* Footer */}
        <div className="bg-stone-950 p-3 text-center border-t border-stone-800 text-[10px] text-stone-500 font-chakra">
          Comercial Jarros • 2026
        </div>
      </div>
    </div>
  );
};
