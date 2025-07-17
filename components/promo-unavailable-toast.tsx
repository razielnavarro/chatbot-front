"use client";

import { useEffect } from "react";
import { Calendar, X } from "lucide-react";

interface PromoUnavailableToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function PromoUnavailableToast({
  message,
  show,
  onClose,
}: PromoUnavailableToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-4 border-red-600 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg">¡Promoción no disponible!</h3>
              <p className="text-white/90 text-sm">Vuelve pronto</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">⏰</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {message}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 font-semibold text-sm">
                💡 <strong>Tip:</strong> Guarda esta página y regresa el día de
                la promoción
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
