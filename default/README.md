# default

This namespace contains the general-purpose user-facing workloads for the homelab. These apps are deployed as regular services in the cluster and typically live under a single namespace for simpler ingress and shared infrastructure.

Current workloads in this namespace include:

* [audiobookshelf](audiobookshelf/)
* [calibre](calibre/)
* [codeserver](codeserver/)
* [etherpad](etherpad/)
* [external-services](external-services/)
* [gateway](gateway/)
* [grimmory](grimmory/)
* [homepage](homepage/)
* [immich](immich/)
* [linkwarden](linkwarden/)
* [mangayomi-server](mangayomi-server/)
* [mangayomi-sync-server](mangayomi-sync-server/)
* [navidrome](navidrome/)
* [ollama](ollama/)
* [ownfoil](ownfoil/)
* [prowlarr](prowlarr/)
* [qbittorrent](qbittorrent/)
* [shelfmark](shelfmark/)
* [tautulli](tautulli/)
* [uptime-kuma](uptime-kuma/)
* [vaultwarden](vaultwarden/)

This area is intentionally broad; individual subdirectories hold the Kubernetes manifests for each workload and any associated configuration.
