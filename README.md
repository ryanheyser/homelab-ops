### GitOps workflow for a Kubernetes homelab
![Kubernetes](https://i.imgur.com/p1RzXjQ.png)

## :book:&nbsp; Overview
![](https://i.imgur.com/KHFP4uR.png)

This repo stores the declarative configuration for a Flux-managed Kubernetes cluster. The cluster is bootstrapped and provisioned using the companion [homelab-infrastructure repo](https://github.com/ryanheyser/homelab-infrastructure), while this repo contains the workloads and GitOps configuration that keep the cluster running.

## :computer:&nbsp; Infrastructure

See [homelab-infrastructure](https://github.com/ryanheyser/homelab-infrastructure) for the underlying hardware, bootstrapping, and cluster lifecycle setup. This repo assumes a Flux bootstrap has already been established and is used to manage the desired state of applications and platform services.

## :wrench:&nbsp; Workloads (by namespace / area)

* [cert-manager-system](cert-manager-system/)
* [default](default/)
* [external-secrets](external-secrets/)
* [flux-system-extra](flux-system-extra/)
* [kube-system](kube-system/)
* [network-system](network-system/)
* [storage-system](storage-system/)
* [upgrade-system](upgrade-system/)
* [vault-system](vault-system/)

These directories contain the current Flux-managed workloads and supporting Kubernetes resources for the cluster.

## :robot:&nbsp; Automation

* [Flux](https://github.com/fluxcd/flux2) continuously reconciles the cluster to the state declared in this repository.
* [Renovate](https://github.com/renovatebot/renovate) scans the repo for image and Helm chart updates and opens pull requests for review.
* [System Upgrade Controller](https://github.com/rancher/system-upgrade-controller) handles k3s upgrades across the cluster.
* [Kured](https://github.com/weaveworks/kured) reboots nodes when required after package or kernel updates.
