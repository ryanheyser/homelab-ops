# external-secrets

This area configures the shared secret-store connection used by External Secrets Operator.

## Resources

* [external-secrets/](external-secrets/) contains a `ClusterSecretStore` named `vault`. It points
  to the Vault service in `vault-system` and reads from Vault's `secret` KV v2 mount, using a token
  provided by the `vault-token` Kubernetes Secret in `kube-system`.

Workload-specific secret synchronization is declared alongside the workloads that consume those
secrets. Do not put secret values in this repository; use `ExternalSecret` resources that reference
the configured store.
