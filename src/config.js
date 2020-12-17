'use strict'

global.config = {
  visuals: false,
  stats: false,
  intelligence: true,

  debug: {
    active: true,
    scope: {
      global: true,
      memory: true,
      room: true,
      role: true,
      roommanager: true,
    }
  },
}

global.roles = {
  harvester: new Harvester(),
  containerharvester: new ContainerHarvester(),
  hauler: new Hauler(),
  defenserepairer: new DefenseRepairer(),
  repairer: new Repairer(),
  builder: new Builder(),
  upgrader: new Upgrader(),
  supplier: new Supplier(),
  scoreharvester: new ScoreHarvester(),
  remoteharvester: new RemoteHarvester(),
  containerextractor: new ContainerExtractor(),
  signer: new Signer(),
}
