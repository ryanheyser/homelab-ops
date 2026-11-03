# vault-system

This area runs HashiCorp Vault and the scheduled workload that automates unsealing its server
instances.

## Components

* [vault/](vault/) configures Vault as a five-replica HA cluster using integrated Raft storage,
  persistent data and audit volumes, and ingress through Traefik.
* [vault-unseal/](vault-unseal/) defines a scheduled unseal job and its per-instance persistent
  configuration claims. The job reads its required credentials from a Kubernetes Secret.

Vault provides the backend used by the shared secret store configured in
[external-secrets](../external-secrets/). Do not commit Vault credentials, unseal material, or
secret values.
