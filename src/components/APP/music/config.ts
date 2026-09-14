// src/components/APP/music/config.ts
import MusicApp from './index';

export const musicConfig = {
  id: 'hyper-music',
  title: 'Music',
  description: 'Native modular audio playback and library management.',
  icon: '🎵', // Tera jo bhi icon/SVG component hai, use yahan daal dena
  executable_path: 'internal://music', // Internal app hai toh path dummy de sakte hain
  component: MusicApp // 🔥 Yahan tera UI bind ho gaya!
};