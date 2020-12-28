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
- spawn (1)
- harvester (1)
- upgrader (1)

RCL 1
- harvester (2..#slots)
- upgrader (2)
- source container (1)
- container harvester (1)

RCL 2
- 5 extensions => 300 + 250 => 550 energy
- second source container
- first controller container

RCL3

RCL 4
- 10 extensions
- storage



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
