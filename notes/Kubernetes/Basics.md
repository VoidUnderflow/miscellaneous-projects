Kubernetes = k8s = helmsman | pilot

Features:
- Manages containers, ensures there's no downtime.
- Service discovery and load balancing.
- Storage orchestration
- Automated rollouts and rollbacks
- Automated bin packing: you provide nodes (the physical bit that containers run on) and how much RAM&CPU/container => k8s does the rest.
- Secret and config management.
- Horizontal scaling
- IPv4/IPv6 dual stack
- Dev | Ops separation: containers are created at build time, rather than deployment time -> aka, gotta have the containers before deploying resources.
- Surfaces OS-level info, metric, app health & other signals.
- Microservices: apps are broken into smaller, independent pieces.
- Resource isolation.

K8s doesn't:
- Deploy source code and build your application. -> isn't this false though?
- Doesn't provide app-level services (I think you build them yourself?)
- Doesn't dictate logging, monitoring, etc. (you configure it yourself, again)

Historical context:
Apps run on physical servers :X: resource allocation issues ->
Virtualised deployments :X: run multiple VMs on a single CPU, but each VM runs its own OS -> 
Containers share the OS


Sources:
- https://kubernetes.io/docs/concepts/