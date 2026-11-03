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

### Components of a cluster
#### Control plane
If I understand it correctly, the control plane can have multiple nodes as well. Typically there are 3 of them in a cluster, for redundancy.
- kube-apiserver: 
	- exposes Kubernetes HTTP API, which is the front end of the control plane; 
	- one per control plane node, behind a load balancer;
- etcd: 
	- cluster's KV store; 
	- one per control plane node, each instance is a member of the same distributed DB;
- kube-scheduler: 
	- watches for newly created pods with no assigned node and ... assigns them a node; 
	- one per node, but only one per cluster acts as leader while others are on standby;
- kube-controller-manager:
	- each controller is a separate process logically, but they are compiled into a single binary and run in a single process (goroutines run concurrently);
	- example controllers:
		- node: monitors nodes, responds when one goes down;
		- job: watches for job objects (one-off tasks) then creates pods to run those tasks to completion;
		- endpointSlice: populates "EndpointSlice" objects (which provide a link between Services and Pods);
		- serviceAccount: creates default "ServiceAccounts" (I love self-referential definitions)
	- same as kube-scheduler in terms of one per node...
- cloud-controller-manager: 
	- embeds cloud-specific controller logic;

#### Node components
- kubelet:
	- makes sure containers are running in a pod (respecting "PodSpecs")
- kube-proxy:
	- maintains network rules on nodes -> communication within and outside cluster;
	- not needed if using a network plugin;
- container runtime: CRI-O, containerd, Docker.

#### Addons
Must haves: DNS, dashboard;
Others: Container resource monitoring, cluster-level logging (where does Grafana come in?), network plugins.