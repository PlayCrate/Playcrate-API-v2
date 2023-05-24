import prom from 'prom-client';

const CPUUsage = new prom.Gauge({
    name: 'current_cpu_usage',
    help: 'Current CPU Usage',
});

const MemoryUsage = new prom.Gauge({
    name: 'current_memory_usage',
    help: 'Current Memory Usage',
});

export { CPUUsage, MemoryUsage };