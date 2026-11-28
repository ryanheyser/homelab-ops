# IP addresses pinned in this repository.
#
# IPv6 conventions (router plan 2026-11-27):
#   MLB_V6_PREFIX = last /64 of the Comcast-delegated /60, now 2601:c2:a00:74cf.
#                   It changes if Comcast renumbers. The router script v6-metallb-list and the
#                   ipv6-prefix-sync CronJob (network-system/metallb) both follow it, and Flux
#                   substitutes it from ConfigMap flux-system/cluster-ipv6-prefix.
#   MetalLB VIPs mirror IPv4: 10.0.<pool>.<n>  ->  ${MLB_V6_PREFIX}::<pool>:<n>
#   Hosts on vlan11 mirror IPv4: 10.0.<a>.<b>  ->  ULA fd00:11::<a>:<b> (stable) and
#                   GUA <vlan11 /64>::<a>:<b> (dynamic, now 2601:c2:a00:74c4::/64),
#                   via an IPv6 token on the host.
#   status: active      = configured in this repo today
#           planned     = configured in this repo, live once the cluster is dual-stack
#           reserved    = address held for a future IPv6 twin; no manifest uses it yet
#
# ExternalName Services and Endpoints below are IPv4-only. Kubernetes cannot mix families there,
# so IPv6 for those hosts is reached directly (router forward / DNS AAAA), not through the cluster.
---
ranges:
  - cidr: "10.0.100.0/24"
    use: MetalLB pool "system"
    file: network-system/metallb/config.yaml
  - cidr: "${MLB_V6_PREFIX}::100:0/112"
    use: MetalLB pool "system" (IPv6)
    status: planned
    file: network-system/metallb/config.yaml
  - cidr: "10.0.101.0/24"
    use: MetalLB pool "default"
    file: network-system/metallb/config.yaml
  - cidr: "${MLB_V6_PREFIX}::101:0/112"
    use: MetalLB pool "default" (IPv6)
    status: planned
    file: network-system/metallb/config.yaml
  - cidr: "${MLB_V6_PREFIX}::/64"
    use: Whole MetalLB /64. The router blackholes it ("v6srv-mlb blackhole"); BGP /128s from MetalLB win.
    status: active (router)
  - cidr: "10.99.1.0-10.99.1.9"
    use: Multus host-local range qbittorrent-vpn (subnet 10.99.0.0/18, gw 10.99.0.1)
    file: default/qbittorrent/vpn.yaml
  - cidr: "10.99.1.10-10.99.1.19"
    use: Multus host-local range seedbox-vpn (subnet 10.99.0.0/18, gw 10.99.0.1)
    file: default/qbittorrent/vpn.yaml
  - cidr: "10.99.1.20-10.99.1.29"
    use: Multus host-local range prowlarr-vpn (subnet 10.99.0.0/18, gw 10.99.0.1)
    file: default/prowlarr/vpn.yaml
  - cidr: "fd00:255::/56"
    use: Pod CIDR (IPv6), set in homelab-infrastructure rke2-p1.yml / rke2-p5.yml
    status: planned
  - cidr: "fd00:254::/112"
    use: Service CIDR (IPv6), set in homelab-infrastructure rke2-p1.yml / rke2-p5.yml
    status: planned
  - cidr: "fd00:11::/64"
    use: Node IPv6 (node-ip and Calico autodetection), fd00:11::<a>:<b> per node
    status: planned
ipam:
  - ip: "10.0.0.8"
    ipv6: "fd00:11::8"
    status: active (IPv4), reserved (IPv6)
    service:
      - truenas-storage-ip
      - truenas-awoofy-ip
      - truenas-kracko-ip
    file:
      - default/external-services/endpoints.yaml
      - default/external-services/services.yaml
  - ip: "10.0.1.1"
    ipv6:
      - "fd00:11::1:1"
      - "<vlan11 /64>::1:1"
    status: active (IPv4), active (IPv6 router forward tcp 32400 via address list v6-plex)
    service:
      - plex-ip
      - vividria-ip
    file:
      - default/external-services/endpoints.yaml
      - default/external-services/endpointslices.yaml
      - default/external-services/services.yaml
  - ip: "10.0.1.3"
    ipv6:
      - "fd00:11::1:3"
      - "<vlan11 /64>::1:3"
    status: active (IPv4), active (IPv6 router forward tcp 32400 via address list v6-plex)
    service: walky-ip
    file:
      - default/external-services/endpoints.yaml
      - default/external-services/endpointslices.yaml
      - default/external-services/services.yaml
  - ip: "10.0.100.1"
    ipv6: "${MLB_V6_PREFIX}::100:1"
    status: active (IPv4), planned (IPv6; router forward tcp 443 via v6-mlb-ingress)
    pool: system
    shared: traefik-share
    service: traefik
    file: network-system/traefik/traefik.yaml
  - ip: "10.0.100.3"
    ipv6: "${MLB_V6_PREFIX}::100:3"
    status: active (IPv4), planned (IPv6; router forward tcp/udp 53,853 via v6-mlb-dns)
    pool: system
    shared: adguard-share
    service:
      - adguard-home-dns-tcp
      - adguard-home-dns-tls-tcp
      - adguard-home-dns-quic-udp
      - adguard-home-dns-udp
      - adguard-home
      - adguard-dns
    file: network-system/adguard/service.yaml
  - ip: "10.0.100.4"
    ipv6: "${MLB_V6_PREFIX}::100:4"
    status: active (IPv4), reserved (IPv6)
    pool: system
    service: blocky-dns
    file: network-system/blocky/service.yaml
  - ip: "10.0.101.2"
    ipv6: "${MLB_V6_PREFIX}::101:2"
    status: active (IPv4), reserved (IPv6)
    pool: default
    shared: calibre-share
    service:
      - calibre-main
      - calibre-webserver
      - calibre-connect
    file: default/calibre/calibre.yaml
  - ip: "10.0.101.5"
    ipv6: "${MLB_V6_PREFIX}::101:5"
    status: active (IPv4), planned (IPv6; router forward tcp 6881,6882 via v6-mlb-seedbox)
    pool: default
    shared: qbittorrent-share
    service:
      - qbittorrent-bittorrent
      - seedbox-bittorrent
    file:
      - default/qbittorrent/qbittorrent.yaml
      - default/qbittorrent/seedbox.yaml
  - ip: "10.0.101.6"
    ipv6: "${MLB_V6_PREFIX}::101:6"
    status: active (IPv4), reserved (IPv6; Service is ipFamilyPolicy SingleStack)
    pool: default
    service: immich-loadbalancer
    file: default/immich/loadbalancer.yaml
  - ip: "10.0.101.10"
    ipv6: "${MLB_V6_PREFIX}::101:10"
    status: active (IPv4), reserved (IPv6)
    pool: default
    shared: mangayomi-sync-share
    service: mangayomi-sync-server-sync
    file: default/mangayomi-sync-server/mangayomi-sync-server.yaml
