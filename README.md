# Autobots AI

A collection of JavaScript libraries to build automated assistants to accomplish vague objectives using LLMs. Comparable to [LangChain](https://python.langchain.com/docs/get_started/introduction.html) but with no ecosystem, strong typing, an explicit focus on autonomous agents, and a Transformers™-inspired naming spin (not actually affiliated with Hasbro, Toei Animation, or Transformers in any way).

## WTF did you build this?

Fun! LLMs are a relatively novel base building block of programming without dominant abstractions I thought it would be neat to explore. I also found the naming of "chain" in LangChain to irk me ever so slightly (when it's just a single INPUT->OUTPUT you haven't chained anything yet!), so I thought I'd have fun with it in a new way (I'm a sucker for themed libs).

You should almost definitely use LangChain instead of this though. What makes LangChain great is the enormous community of plugins, python as a dominant language for ML in general, and the plethora of eager-to-help expertise around it.

## API

### Simple Machines

The most basic machine is a passthrough of the prompt.

```js
import {PromptMachine} from '@autobots-ai/core';

const model = new OpenAIChatCompletionModel({model: 'gpt-3.5-turbo'});
const machine = new PromptMachine({model});
const {output} = await machine.run(`What does AGI stand for?`);
expect(output).toContain('Artificial General Intelligence');
```

### Complex Machines

We can also link machines together in more complex ways.

```js
import {PromptMachine, FanoutMachine, SequenceMachine} from '@autobots-ai/core';
import {WordpressMachine} from '@autobots-ai/wordpress';

// Come up with many ideas.
const ideaMachine = new PromptMachine({
  model,
  template: ({topic}) => `Come up with 10 blog post ideas for ${topic} separated by newlines`,
  parser: (output) => output.split('\n'),
});

// Write a post for a given idea.
const writerMachine = new PromptMachine({
  model,
  template: ({topic}) => `Write a detailed blog post about ${topic}`,
  parser: (output, {topic}) => ({title: topic, body: output}),
});

// Combine the two to write a post for each idea.
const postMachine = new FanoutMachine({model, source: ideaMachine, destination: writerMachine});

// Publish a given post to WordPress.
const publisherMachine = new WordpressPostMachine({
  origin: 'https://www.myblog.com',
  username: process.env.WORDPRESS_USER,
  password: process.env.WORDPRESS_PASS,
  transform: ({title, body}) => ({title, body, author: 'Mr. Auto I. Bot', status: 'draft'}),
});

// Put it all together. Come up with ideas, write them, and then post them.
const bloggingMachine = new SequenceMachine({model, machines: [postMachine, publisherMachine]});

await bloggingMachine.run({topic: 'Transformers'});
```

### Autobots Assemble!

```js
import {assemble} from '@autobots-ai/core';
import {BrowserMachine, FilesystemMachine} from '@autobots-ai/machines';

// Autobots Assemble!
const downloaderBot = assemble()
  // Supports browsing the internet.
  .machine((context) => new BrowserMachine(context))
  // Supports reading and writing to the filesystem.
  .machine(
    (context) => new FilesystemMachine({...context, scope: `${process.env.HOME}/Autobots/Sandbox`})
  );

const mission = await downloaderBot.mobilize(`
  Find the best 10 recent articles from diverse, high-quality sources about AGI and save them
  in markdown to ~/Autobots/Sandbox/agi-articles in the format described in """ below.

  """
  Title: TITLE_GOES_HERE
  Link: LINK_GOES_HERE
  Publisher: PUBLISHER_NAME_GOES_HERE
  Author: AUTHORS_NAME_GOES_HERE
  ---

  ARTICLE_BODY_GOES_HERE
  """
`);

mission.on('step', (event) => console.log(event.input, event.output, event.machine));
mission.on('progress', (event) => console.log(event.milestone));

const plan = await mission.plan();
await mission.completion({milestone: plan.milestones[1]});
console.log('Achieved 2nd Milestone!');
await mission.completion();
console.log('Done!');
```

## Concepts

- Autobot: an autonomous agent capable of using machines and a brain to achieve an objective.
  - Machine: a set of capabilities composed of a directed acyclic graph of cogs, optionally including a manual for use by an autobot.
    - Manual: a description of a machine's inputs, outputs, and observations.
    - Cog: a function that accepts input and produces output, a machine can itself may be a cog in another machine.
  - Brain: a system capable of using machines in pursuit of an objective, typically using a model, collection of memories, and a strategy.
    - Model: a construct (usually a large language model) that can make predictions based on prompts.
    - Memory: a construct that retains knowledge from past prompts and their corresponding outputs.
    - Strategy: a specific class of machine that accepts an objective and produces a plan with an algorithm (series of templates) for reducing / solving the objective.
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

## TODO

- Everything ;)
- Convert into turborepo (core, machines, sdk)
- work through API example with podcast, conversion to text, indexing, and performing q&a
- add base implmenetations
  - machines / templates / prompts / cogs
  - manuals
  - models
  - memory
  - strategy
  - brain
  - autobot
