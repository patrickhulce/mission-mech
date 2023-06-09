# Autobots AI

A JavaScript library to build automated assistants to accomplish vague objectives using LLMs. Comparable to LangChain but with a Transformers™-inspired naming spin (not actually affiliated with Hasbro, Toei Animation, or Transformers in any way).

## Concepts

- Autobot: an autonomous agent capable of using machines and a brain to achieve an objective.
  - Machine: a set of capabilities composed of a directed acyclic graph of cogs, optionally including a manual for use by an autobot.
    - Manual: a description of a machine's inputs, outputs, and observations.
    - Cog: a function that accepts input and produces output, a machine can itself may be a cog in another machine.
  - Brain: a system capable of using machines in pursuit of an objective, typically using a model, collection of memories, and a strategy.
    - Model: a construct (usually a large language model) that can make predictions based on prompts.
    - Memory: a construct that retains knowledge from past prompts and their corresponding outputs.
    - Strategy: a collection of templates that are used by a brain in concert with a model and memories.
    - Template: a function with well-defined inputs that, when provided, produces a prompt.
    - Prompt: a natural language string of instructions that can be used as input to a model.
    - Objective: a natural language description of a desired state to pursue.

### Machines

Machines are to autobots as functions are to programming. They are fundamental, composable, and varied in scope. Machines are the basic building blocks of autobots and are extremely flexible.

Machines with similar capabilities that satisfy a shared contract are grouped into types. `autobots-ai` provides several common machine types out-of-the-box.

#### Converter Machines

Machines that convert varied input formats into a text-based document.

Converter machines share a common input intent (a reference to available information) and output format (a document).

Coming soon.

#### Indexer Machines

Machines that make varied input formats available in an index, usually paired with converter and retriever machines.

Indexer machines share a common input intent (a reference to available information) and output intent (confirmation of storage).

Coming soon.

#### Retrieval Machines

Machines that retrieve information from an index. If the information sources are _not_ statically available, then they will be paired with an indexer machine. If the information sources _are_ statically defined, then they will not be paired with an indexer machine.

Retrieval machines share a common input format (a natural language query of information) and output format (a list of relevant subdocuments).

Coming soon.

### LangChain Comparisons

Model -> Model
Prompt -> Prompt
Memory -> Memory
Chain -> Machine
Tool -> Machine+Manual
Agent -> Strategy
Agent Executor -> Autobot
