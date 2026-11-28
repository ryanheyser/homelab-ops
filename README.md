# GitOps workflow for a Kubernetes homelab

![Kubernetes](https://i.imgur.com/p1RzXjQ.png)

## :book:&nbsp; Overview

![Homelab overview](https://i.imgur.com/KHFP4uR.png)

This repo stores the declarative configuration for a Flux-managed RKE2 cluster. The cluster is created and
bootstrapped by the companion [homelab-infrastructure repo](https://github.com/ryanheyser/homelab-infrastructure);
this repo holds the workloads and GitOps configuration that keep it running.

## :computer:&nbsp; Infrastructure

See [homelab-infrastructure](https://github.com/ryanheyser/homelab-infrastructure) for the hardware, node
provisioning, RKE2 install and Flux bootstrap. This repo assumes Flux is already bootstrapped and manages the
desired state of applications and platform services from there.

## :globe_with_meridians:&nbsp; Networking

* The cluster is IPv4/IPv6 dual-stack. Services that need an IPv6 address use `ipFamilyPolicy: PreferDualStack`
  with IPv4 listed first.
* [MetalLB](network-system/metallb/) advertises LoadBalancer VIPs to the router over BGP. IPv4 VIPs come from
  `10.0.100.0/24` (system) and `10.0.101.0/24` (default); IPv6 VIPs come from the matching `/112` ranges in a
  public `/64` delegated by the ISP.
* The delegated IPv6 prefix can change. The `ipv6-prefix-sync` CronJob writes the current prefix to the
  `flux-system/cluster-ipv6-prefix` ConfigMap, and Flux substitutes it as `${MLB_V6_PREFIX}` in the
  `network-system` and `default` Kustomizations.
* Public DNS for `heyser.xyz` is split by record type:
  [cloudflare-ddns](network-system/cloudflare-ddns/) keeps the A records on the router's public IPv4, and
  [external-dns](network-system/external-dns/) publishes AAAA records from the Traefik Service's IPv6 VIP.
* [IPAM.yaml.md](IPAM.yaml.md) lists every reserved address, IPv4 and IPv6.

## :wrench:&nbsp; Workloads (by namespace / area)

* [cert-manager-system](cert-manager-system/)
* [default](default/)
* [external-secrets](external-secrets/)
* [flux-system](flux-system/)
* [flux-system-extra](flux-system-extra/)
* [kube-system](kube-system/)
* [network-system](network-system/)
* [storage-system](storage-system/)
* [upgrade-system](upgrade-system/)
* [vault-system](vault-system/)

Flux applies these areas in dependency order (see [gotk-ordering.yaml](flux-system/gotk-ordering.yaml)). Secrets
are never committed: workloads declare `ExternalSecret` resources that read from Vault.

## :robot:&nbsp; Automation

* [Flux](https://github.com/fluxcd/flux2) continuously reconciles the cluster to the state declared in this
  repository.
* [Renovate](https://github.com/renovatebot/renovate) scans the repo for image and Helm chart updates and opens pull
  requests for review.
* [System Upgrade Controller](https://github.com/rancher/system-upgrade-controller) upgrades RKE2 on the server and
  agent nodes from pinned upgrade plans.
* A pull request workflow renders every changed `HelmRelease` with `helm template` and comments the manifest diff
  against the default branch.

## :white_check_mark:&nbsp; Validating changes

Render and lint locally before opening a pull request; never apply rendered output to the cluster by hand.

```bash
yamllint -c .github/lint/.yamllint.yaml <changed-files>
kustomize build <directory>
pre-commit run --all-files
```

See [AGENTS.md](AGENTS.md) and [GOVERNANCE.md](GOVERNANCE.md) for the full change rules.
