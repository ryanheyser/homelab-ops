# upgrade-system

This namespace manages automated RKE2 upgrades. The system-upgrade-controller watches the upgrade plans and
applies them to nodes one at a time.

Current resources:

* [system-upgrade-controller](system-upgrade-controller/)

The directory holds the controller, its RBAC, and two plans: `rke2-server` for control-plane nodes and
`rke2-agent` for workers. Both pin an explicit RKE2 version (for example `v1.37.2+rke2r1`) that Renovate keeps
current; agents upgrade after the servers.
