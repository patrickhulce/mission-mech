export const COMMON_FORMATS = {
  NATURAL_LANGUAGE: 'any sentence, paragraph, or article of text in natural language',
  JSON: 'a JSON-serialized representation of the value',
  CSV: 'a comma-separated list of values with each value enclosed in double quotes ("")',
};

export interface Machine<TInput, TOutput> {
  run(input: TInput): Promise<TOutput>;
  manual?: Manual;
}

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
  getPurpose(): string;
  getSummaryOfContents(): string;
  search(query: string): Promise<string>;
}

export type Strategy = Machine<{objective: string; milestones?: string}, {plan: Plan}>;

export interface Template<TInput> {
  resolveToPrompt(input: TInput): string;
}

export interface Autobot {
  mobilize(objective: string, options?: MissionOptions): Promise<Mission>;
}

export interface MissionOptions {
  budgetInDollars?: number;
  milestones?: string | Milestone[];
}

export interface Mission {
  plan(): Promise<Plan>;
  completion(): Promise<void>;

  on(event: 'step', listener: (step: MissionStep) => void): void;
}

enum Status {
  Queued = 'queued',
  Active = 'active',
  Complete = 'complete',
  Failed = 'failed',
}

export interface MissionStep_ {
  input: unknown;
  machine: Machine<unknown, unknown>;
}

type MissionStep =
  | ({status: Exclude<Status, Status.Complete>} & MissionStep_)
  | ({status: Status.Complete; output: unknown} & MissionStep_);

export interface Plan {
  milestones: Milestone[];
  getNextStep(): Promise<MissionStep>;
}

export interface Milestone {
  id: string;
  name: string;
  objective: string;
}
