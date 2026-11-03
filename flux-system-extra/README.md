# flux-system-extra

This directory holds the additional Flux configuration that supports the GitOps stack beyond the core bootstrap manifests in [flux-system](../flux-system/).

The main content here is the chart repository catalog used by Flux `HelmRepository` objects:

* [helm-chart-repositories](helm-chart-repositories/)

This keeps Helm source definitions centralized so cluster components can reconcile their chart dependencies from the repo without embedding external sources into each individual release.
