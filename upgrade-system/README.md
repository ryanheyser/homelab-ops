# upgrade-system

This namespace manages the automated upgrade pipeline for the k3s cluster. The system-upgrade-controller watches for upgrade plans and applies them to nodes according to the configured schedule and version strategy.

Current resources:

* [system-upgrade-controller](system-upgrade-controller/)

The system-upgrade-controller manifests provide the controller and CRDs; the plan objects in this area are what drive upgrades to newer k3s releases as they become available.
