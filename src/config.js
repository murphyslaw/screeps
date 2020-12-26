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

  roles: [
    'Harvester',
    'ContainerHarvester',
    'Hauler',
    'Defender',
    'DefenseRepairer',
    'Repairer',
    'Builder',
    'Upgrader',
    'Supplier',
    'ScoreHarvester',
    'RemoteHarvester',
    'ContainerExtractor',
    'Signer',
    'Dismantler',
    'Scorer',
    'Claimer',
  ],
}
