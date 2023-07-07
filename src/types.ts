export const COMMON_FORMATS = {
  NATURAL_LANGUAGE: 'any sentence, paragraph, or article of text in natural language',
  JSON: 'a JSON-serialized representation of the value',
  CSV: 'a comma-separated list of values with each value enclosed in double quotes ("")',
};

export interface Machine<TInput, TOutput> {
  /** Runs the machine on the input to produce the output. */
  run(input: TInput): Promise<TOutput>;
  /** A description of the machine's inputs, outputs, and functionality. */
  manual?: Manual;
}

export type DocumentedMachine<TInput, TOutput> = Required<Machine<TInput, TOutput>>;

export interface FormatDescription {
  /** A description of the type of content expected. */
  format: string;
  /** A typescript definition of the type definition of the content once parsed. */
  typedef: string;
  /** The meaning of the content in the context of the task. */
  semantics: string;
  /** A specific stringified example of this format. */
  example: string;
}

export interface Manual {
  /**
   * A high-level description of the machine's capabilities / purpose.
   * The grammar of this description should complete the sentence "A machine that..."
   * @example "Extracts a list of famous people's names from a piece of text."
   */
  summary: string;
  /**
   * A detailed description of the machine's capabilities / purpose written as an instruction.
   * The grammar of this description should constitue a command in the 2nd person.
   * It should contain the phrase "in the following input format."
   * @example "Extract the first and last name of each well known person referenced in the following input format."
   */
  instruction: string;
  /**
   * A detailed description of the machine's input type definition, format, and semantics.
   * The grammar of this description should be a fragment of a sentence without punctuation.
   * @example "
   * Type definition: string
   * Format: any sentence, paragraph, or article of text in natural language
   * Semantics: the written content from which the names of famous people should be extracted
   * Example: ```Brad Pitt and Matt Damon starred in Ocean's Eleven.```
   * "
   */
  input: FormatDescription;
  /**
   * A detailed description of the machine's output type definition, format, and semantics.
   * The grammar of this description should be a fragment of a sentence without punctuation.
   * @example "
   * Type definition: string[]
   * Format: a JSON-serialized representation of the value.
   * Semantics: the first and last names of the famous people that were extracted
   * Example: ```[ "Brad Pitt", "Matt Damon" ]```
   * "
   */
  output: FormatDescription;
}

export interface Brain {
  model: Model;
  memory: Memory[];
  strategy: Strategy;
}

export interface Model {
  predict(
    input: string
  ): Promise<{output: string; cost: {inputTokens: string; outputTokens: string}}>;
}

export interface Memory {
  /** Returns a brief description of the _type_ of data that memory is meant to store, not its actual contents. */
  getPurpose(): string;
  /** Summarizes the actual contents of the memory at a high level. */
  getSummaryOfContents(): string;
  /** Returns information related to the query that's contained in memory. */
  search(query: string): Promise<string>;

  // The way memory is added / indexed varies greatly between memory types.
  // Entity memory -> entity key + information about the entity.
  // History/context memory -> a list of events + compaction strategy.
}

export interface StrategyState {
  // What's available for the strategy to utilize.
  model: Model;
  memory: Memory[];
  tools: DocumentedMachine<unknown, unknown>[];

  // Context and history for manual inspection.
  stepsTaken: StepState[];
  plan: Plan;

  // Goals and task information that the strategy is currently executing against.
  currentMilestone: Milestone;
}

export interface Strategy {
  createPlan(data: {objective: string; milestones?: string[]}): Promise<Plan>;
  getNextStep(current: StrategyState): StepInput;
}

export interface Autobot {
  mobilize(objective: string, options?: MissionOptions): Promise<Mission>;
}

export interface MissionOptions {
  budgetInDollars?: number;
  milestones?: string[] | Milestone[];
}

export interface Mission {
  /** Starts the autobot's planning of the mission. */
  plan(): Promise<Plan>;
  /** Starts the autobot's execution of the mission. */
  execute(): Promise<void>;

  on(event: 'plan', listener: (plan: Plan) => void): void;
  on(event: 'step', listener: (step: StepState) => void): void;
  on(event: 'complete', listener: () => void): void;
}

enum Status {
  Queued = 'queued',
  Active = 'active',
  Complete = 'complete',
  Failed = 'failed',
}

export interface StepInput<TInput = unknown, TOutput = unknown> {
  /** The machine used for this step. */
  machine: Machine<TInput, TOutput>;
  /** The input provided to the machine for this step. */
  input: TInput;
}

export type StepState<TInput = unknown, TOutput = unknown> =
  | ({status: Exclude<Status, Status.Complete | Status.Failed>} & StepInput<TInput, TOutput>)
  | ({status: Status.Failed; error: Error} & StepInput<TInput, TOutput>)
  | ({status: Status.Complete; output: TOutput} & StepInput<TInput, TOutput>);

export interface Plan {
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  objective: string;
  milestones: Milestone[];
}
