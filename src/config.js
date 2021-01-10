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
    'Charger',
    'Defender',
    'DefenseRepairer',
    'Repairer',
    'Builder',
    'Upgrader',
    'Supplier',
    'ScoreHarvester',
    'RemoteHarvester',
    'RemoteHauler',
    'ContainerExtractor',
    'Scorer',
    'Signer',
    // 'Dismantler',
    'Claimer',
    'Reserver',
    'Scout',
  ],
}

global.FIND_CONTAINERS = 124
global.FIND_STORAGE = 125
global.FIND_CONTROLLER_CONTAINER = 126
global.FIND_SOURCE_CONTAINERS = 127
global.FIND_EXTENSIONS = 128
global.FIND_TOWERS = 129
global.FIND_UTILITY_STRUCTURES = 130
global.FIND_DEFENSES = 131
global.FIND_MINERAL_CONTAINER = 132

global.DIRECTIONS = [
  TOP,
  TOP_RIGHT,
  RIGHT,
  BOTTOM_RIGHT,
  BOTTOM,
  BOTTOM_LEFT,
  LEFT,
  TOP_LEFT,
]

global.MY_USERNAME = 'Murphlaw'
