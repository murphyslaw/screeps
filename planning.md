# room
  - stateMachine => new StateMachine(actor: room)

room.update()
  - stateMachine.update()

# role
  - actor

# creep
  - role => new Role(actor: creep) TODO: need role object?
  - stateMachine => new StateMachine(actor: creep)

creep.update()
  - stateMachine.update()

# stateMachine
  - actor
  - memory => actor.memory
  - currentState => memory.currentState || 'Spawning' => new Spawning(actor: actor)
  - previousState => memory.previousState || 'Spawning' => new Spawning(actor: actor)

stateMachine.update()
  - currentState.execute()

stateMachine.changeState(nextState)
  - previousState = currentState
  - currentState.exit()
  - currentState = nextState
  - currentState.enter()

stateMachine.revertState()
  - changeState(previousState)

# state
  - actor
  - memory => actor.memory.state TODO: need memory object?

state.enter()

state.run()
  - updateTarget()
    - findRoom()
    - findTarget()
  - executeAction()
    - action.execute()
  - updateMovement()
    - move.execute()

state.exit()


# build order
RCL 0
- spawn (1) => 300 energy
- harvester (1)
- upgrader (1)

RCL 1
- harvester (2..#slots)
- upgrader (2)
- container (1, mineral)
- container harvester (1)
- inner roads

RCL 2
- 5 extensions (5) => 300 + 250 => 550 energy
- container (2, mineral)
- container (3, controller)

RCL3
- 5 extensions (10) => 300 + 250 + 250 => 800 energy
- tower (1)

RCL 4
- 10 extensions (20) => 300 + 250 + 250 + 500 => 1300 energy
- storage
- walls
- ramparts
- exit roads

RCL 5
- 10 extensions (30) => 300 + 250 + 250 + 500 + 500 => 1800 energy
- tower (2)
- structure ramparts

RCL 6
- container (4, mineral)



# Harvester
harvester.number =>
  - sum
    - in territory &&
    - sources || minerals &&
    - without container &&
    - number of slots

harvesting.findRoom =>
  - in territory &&
  - sources || minerals &&
  - without container &&

harvesting.findTarget =>
  - sources || mineral &&
  - without container &&
