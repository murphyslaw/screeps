# world
- colonies: colony[]

# colony
- rooms: room[]
- home: room
- spawns: spawn[]

# room
- stateMachine => new StateMachine(actor: room)
- currentState: state => [defending, initiating]
- role: [home, remote]
- colony: colony
- sources
- mineral

room.update()
- stateMachine.update()

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
