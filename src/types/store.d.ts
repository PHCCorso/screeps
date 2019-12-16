interface Store extends StoreDefinition {
    getCapacity: (
        resource?: _ResourceConstantSansEnergy | ResourceConstant
    ) => number;
    getFreeCapacity: (
        resource?: _ResourceConstantSansEnergy | ResourceConstant
    ) => number;
    getUsedCapacity: (
        resource?: _ResourceConstantSansEnergy | ResourceConstant
    ) => number;
}
