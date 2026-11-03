# storage-system

This area configures the cluster's NFS-backed storage and CloudNativePG operator.

## Components

* [cloudnative-pg/](cloudnative-pg/) installs CloudNativePG and its Barman Cloud plugin.
* [csi-nfs/](csi-nfs/) installs the NFS CSI driver and defines the
  `nfs-dynamic-database` storage class for the database NFS share.
* [nfs-client-provisioner/](nfs-client-provisioner/) configures NFS subdirectory
  provisioning, including the `nfs-dynamic` and `nfs-dynamic-ss` storage classes.

Storage class reclaim policies and NFS paths are configured in the workload manifests. Review
those settings carefully when changing storage behavior or removing workloads.
