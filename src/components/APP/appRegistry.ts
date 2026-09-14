import { SystemAppExtended } from '../../store/useAppStore';

// 🚀 Naye Plug-and-Play imports
import { musicConfig } from './music/config';
import { recorderConfig } from './recorder/config';

// 🧩 Registry ab sirf configs ko combine kar rahi hai
export const CORE_APPS: SystemAppExtended[] = [
  {
    ...musicConfig,
    status: 'idle',
    mode: 'balanced'
  },
  {
    ...recorderConfig,
    status: 'idle',
    mode: 'balanced'
  }
];