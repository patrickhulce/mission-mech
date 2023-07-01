import {Machine, Manual, Model} from './types';

export class SimpleMachine<TInput, TOutput> implements Machine<TInput, TOutput> {
  public manual: Manual | undefined;

  constructor(public run: (input: TInput) => Promise<TOutput>, options?: {manual?: Manual}) {
    this.manual = options?.manual;
  }
}

export interface PromptMachineOptions<TInput, TOutput> {
  model: Model;
  template: (input: TInput) => string;
  parser: (output: string, input: TInput) => TOutput;
  manual?: Manual;
}

export class PromptMachine<TInput, TOutput> implements Machine<TInput, TOutput> {
  public manual: Manual | undefined;
  private options: PromptMachineOptions<TInput, TOutput>;

  public constructor(options: PromptMachineOptions<TInput, TOutput>) {
    this.options = {
      ...options,
    };

    this.manual = this.options.manual;
  }

  async run(input: TInput): Promise<TOutput> {
    const prompt = this.options.template(input);
    const response = await this.options.model.predict(prompt);
    const output = this.options.parser(response.output, input);
    return output;
  }
}

export function fromManual<TInput, TOutput>(
  manual: Manual,
  options: Omit<PromptMachineOptions<TInput, TOutput>, 'template' | 'parser'>
): Machine<TInput, TOutput> {
  return new PromptMachine({
    template: (input) => `
      Complete the following task using the provided input.

      ${manual.instruction}

      The input will be ${manual.input.semantics} \\
      formatted as ${manual.input.format} \\
      contained in """ below \\
      and match a type definition of \`${manual.input.typedef}\`.

      The output should be ${manual.output.semantics} \\
      formatted as ${manual.output.format} \\
      and match a type definition of \`${manual.output.typedef}\`.

      Input: """${JSON.stringify(input)}"""
    `,
    parser: (output) => JSON.parse(output),
    ...options,
  });
}
