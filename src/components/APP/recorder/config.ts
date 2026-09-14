import { RecorderApp } from './index';

export const recorderConfig = {
  id: 'hyper-recorder',
  title: 'AI Recorder',
  description: 'Performance-optimized voice recording and real-time modular STT engine.',
  icon: 'Mic', // Tera Sidebar/Dashboard wala icon
  executable_path: 'internal://hyper-recorder',
  component: RecorderApp 
};