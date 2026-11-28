# kube-system

This namespace contains cluster-level support services that improve scheduling, storage integrations, and operational reliability.

Current components include:

* [admission-policy](admission-policy/): a `MutatingAdmissionPolicy` kept disabled (`.disabled` file, not
  applied).
* [descheduler](descheduler/): evicts pods so the scheduler can rebalance nodes.
* [external-secrets](external-secrets/): installs the External Secrets Operator. The Vault store it reads from
  is in [external-secrets](../external-secrets/).
* [hami](hami/): GPU sharing and virtualization.
* [intel-device-plugins](intel-device-plugins/): the Intel device plugin operator and GPU plugin. The GPU
  metrics exporter (`exporter.yaml`) is commented out until metrics are collected; its header lists the steps to
  enable it.
* [node-feature-discovery](node-feature-discovery/): labels nodes with their hardware features (used for GPU
  placement).
* [reflector](reflector/): copies Secrets and ConfigMaps across namespaces.
* [reloader](reloader/): restarts workloads when a referenced Secret or ConfigMap changes.
