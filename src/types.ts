export const COMMON_FORMATS = {
  NATURAL_LANGUAGE: 'Any sentence, paragraph, or article of text in natural language.',
  CSV: 'A comma-separated list of values with each value enclosed in quotation marks.',
};

export interface Machine<TInput, TOutput> {
  run(input: TInput): Promise<TOutput>;
}

export interface Manual {
  descriptions: {
    /**
     * A high-level description of the machine's capabilities / purpose.
     * The grammar of this description should complete the sentence "A machine that..."
     * @example "Capitalizes the first letter of each word in a string."
     */
    summary: string;
    /**
     * A detailed description of the machine's input type definition, format, and semantics.
     * * The grammar of this description should follow the example below.
     * @example "
     * Type definition: string
     * Format: Any sentence, paragraph, or article of text in natural language.
     * Semantics: The written content from which the names of famous people should be extracted.
     * "
     */
    input: {typedef: string; format: string; semantics: string};
    /**
     * A detailed description of the machine's output type definition, format, and semantics.
     * The grammar of this description should follow the example below.
     * * @example "
     * Type definition: string[]
     * Format: One name for each string in the array.
     * Semantics: The first and last names of the famous people that were extracted.
     * "
     */
    output: {typedef: string; format: string; semantics: string};
  };
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
  getCostInDollars(cost: {inputTokens: string; outputTokens: string}): number;
}

export interface Memory {
  getPurposeDescription(): string;
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
