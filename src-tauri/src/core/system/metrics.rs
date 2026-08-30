use sysinfo::System;
use crate::models::system_types::SystemMetrics;

pub fn get_current_metrics(sys: &mut System) -> SystemMetrics {
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    SystemMetrics {
        // Naye sysinfo version ke hisaab se syntax update kar diya
        cpu_usage: sys.global_cpu_usage(), 
        total_memory: sys.total_memory(),
        used_memory: sys.used_memory(),
    }
}