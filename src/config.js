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
      state: false,
    }
  },

  rooms: {
    W18N28: {
      harvester: 0,
      upgrader: 2,
      containerharvester: 2,
    },
    W18N29: {
      harvester: 1,
      upgrader: 3,
      containerharvester: 1,
    },
  }
}

global.roles = {
  harvester: new Harvester(),
  containerharvester: new ContainerHarvester(),
  hauler: new Hauler(),
  defender: new Defender(),
  defenserepairer: new DefenseRepairer(),
  repairer: new Repairer(),
  builder: new Builder(),
  upgrader: new Upgrader(),
  supplier: new Supplier(),
  scoreharvester: new ScoreHarvester(),
  remoteharvester: new RemoteHarvester(),
  containerextractor: new ContainerExtractor(),
  signer: new Signer(),
  dismantler: new Dismantler(),
  scorer: new Scorer(),
  claimer: new Claimer(),
}
