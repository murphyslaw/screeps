'use strict'

// globals
require('version')
require('utility_logger')
require('utility_monument')
require('utility_monumentpathfinder')
require('utility_monumentvisualizer')
require('utility_invisibleroom')

// prototypes
require('prototypes_lodash')
require('prototypes_room')
require('prototypes_source')
require('prototypes_roomposition')
require('prototypes_creep')
require('prototypes_structure')
require('prototypes_structurecontroller')
require('prototypes_structureextractor')
require('prototypes_mineral')
require('prototypes_store')

// actions
require('actions_action')
require('actions_move')
require('actions_signcontroller')
require('actions_recycle')
require('actions_dismantle')
require('actions_attack')
require('actions_heal')
require('actions_withdraw')
require('actions_score')

// states
require('states_state')
require('states_recycling')
require('states_signing')
require('states_dismantling')
require('states_initializing')
require('states_defending')
require('states_healing')
require('states_refilling')
require('states_scoring')

// roles
require('roles_role')
require('roles_energyrole')
require('roles_creepy')
require('roles_builder')
require('roles_containerextractor')
require('roles_containerharvester')
require('roles_defenserepairer')
require('roles_hauler')
require('roles_harvester')
require('roles_remoteharvester')
require('roles_repairer')
require('roles_scoreharvester')
require('roles_scout')
require('roles_signer')
require('roles_supplier')
require('roles_upgrader')
require('roles_dismantler')
require('roles_defender')
require('roles_scorer')

// configuration
require('config')

require('manager_global')
require('manager_creep')
require('manager_room')
require('manager_stats')
require('manager_world')