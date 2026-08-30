export interface SystemApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  executable_path: string;
  status: 'idle' | 'running' | 'error';
}

export interface EnvironmentData {
  environment_name: string;
  node_status: string;
  apps: SystemApp[];
}