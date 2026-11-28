# network-system

This namespace contains the cluster networking and edge services that expose, secure, and route traffic around the homelab.

Current components include:

* [adguard](adguard/): network DNS resolver and filter, on the dual-stack VIP `10.0.100.3` / `<prefix>::100:3`.
* [authentik](authentik/): identity provider (SSO) for web apps behind Traefik.
* [blocky](blocky/): DNS proxy and ad blocker, with Valkey for its cache.
* [calico](calico/): commented-out Calico `IPReservation` examples for the AdGuard and Traefik VIPs (not
  applied).
* [cloudflare-ddns](cloudflare-ddns/): keeps the `heyser.xyz` A records on the router's public IPv4.
* [external-dns](external-dns/): publishes `heyser.xyz` AAAA records from the Traefik Service's IPv6 VIP (only
  AAAA; it never touches the A records).
* [metallb](metallb/): LoadBalancer VIPs over BGP (IPv4 and IPv6 pools), plus the `ipv6-prefix-sync` CronJob that
  keeps the IPv6 pools on the ISP's current prefix.
* [tailscale](tailscale/): Tailscale operator, subnet-router connector and proxy.
* [traefik](traefik/): ingress controller on the dual-stack VIP `10.0.100.1` / `<prefix>::100:1`.

`<prefix>` is the delegated IPv6 `/64` that Flux substitutes as `${MLB_V6_PREFIX}`. See
[IPAM.yaml.md](../IPAM.yaml.md) for every reserved address.
