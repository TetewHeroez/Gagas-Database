import React from "react";
import { Undo2 } from "lucide-react";

const UndoToast = ({ message, onUndo }) => {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="truncate pr-4">{message}</span>
        <button
          onClick={onUndo}
          className="ml-4 p-2 flex items-center text-sm font-semibold text-blue-300 hover:text-white rounded-md transition-colors flex-shrink-0"
        >
          <Undo2 size={16} className="mr-1.5" />
          <span>Undo</span>
        </button>
      </div>
      {/* Progress Bar Animasi */}
      <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
        <div className="bg-blue-400 h-1 rounded-full animate-progress-bar"></div>
      </div>
    </div>
  );
};

export default UndoToast;
