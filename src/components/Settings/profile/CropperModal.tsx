import Cropper from 'react-easy-crop';
import { ZoomIn, Crop } from 'lucide-react';

export default function CropperModal({ 
  imageSrc, crop, zoom, setCrop, onCropComplete, setZoom, cancelCrop, handleCropSave, isProcessing 
}: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/10 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 shadow-[0_1.5rem_3rem_rgba(0,0,0,0.5)] rounded-3xl w-full max-w-sm overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-300">
        <div className="relative aspect-square w-full max-h-[50vh] bg-black/80">
          <Cropper
            image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false}
            onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
          />
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <ZoomIn className="w-5 h-5 text-slate-400" />
            <input
              type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-700/50 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancelCrop} disabled={isProcessing} className="px-4 py-2 bg-slate-200/20 hover:bg-slate-200/30 text-white rounded-lg text-xs font-semibold transition-all">
              Cancel
            </button>
            <button onClick={handleCropSave} disabled={isProcessing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0.2rem_1rem_rgba(37,99,235,0.4)]">
              {isProcessing ? <span className="animate-pulse">Saving...</span> : <><Crop className="w-3.5 h-3.5" /> Update DP</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}