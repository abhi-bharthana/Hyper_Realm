import { SystemAppExtended } from '../../store/useAppStore';

export const CORE_APPS: SystemAppExtended[] = [
  {
    id: 'hyper-surf',
    name: 'Hyper-Surf',
    description: 'Native isolated web browsing environment with advanced controls.',
    icon: 'Globe',
    executable_path: 'internal://hyper-surf',
    status: 'idle',
    mode: 'balanced'
  },
  {
    id: 'hyper-media',
    name: 'Hyper-Media',
    description: 'High-performance local and stream video playback unit.',
    icon: 'Film',
    executable_path: 'internal://hyper-media',
    status: 'idle',
    mode: 'balanced'
  },
  {
    id: 'hyper-music',
    name: 'Music',
    description: 'Native modular audio playback and library management.',
    icon: 'Music',
    executable_path: 'internal://hyper-music',
    status: 'idle',
    mode: 'balanced'
  }
];