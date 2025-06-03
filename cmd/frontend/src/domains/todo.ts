import { IsDate, IsInt, IsNotEmpty, Length, Max, Min } from 'class-validator';

export interface Todo {
  id: string;
  description: string;
  deadline: Date;
  priority: number;
  done: boolean;

  setId: (newId: string) => void;
  validate: (errors: Record<string, string>) => void;
}

export type TodoPost = Pick<Todo, 'description' | 'done'>;
export type TodoUpdate = Pick<Todo, 'done'>;

export class TodoItem implements Todo {
  id = '';
  @IsNotEmpty({ message: 'Description should not be empty.' })
  @Length(10, undefined, { message: 'Description should be at least 10 characters long.' })
  description = '';
  @IsDate({ message: 'Deadline should be Date format.' })
  deadline: Date = new Date();
  @IsInt({ message: 'Priority should be int value.' })
  @Min(1, { message: 'Priority should be at least 1.' })
  @Max(5, { message: 'Priority should be less than 6.' })
  priority: number;
  done: false;

  public setId = (newId: string): void => {
    this.id = newId;
  };

  public validate = (errors: Record<string, string>): void => {
    console.log(`Description > ${this.description}`);
    if (this.description.length > 20) {
      errors['description'] = 'Description should be cannot exceed a maximum of 20 characters short.';
    }
  };
}

export const customValidateTodo = async (todo: Todo) => {
  if (todo.description.length > 20) {
    throw [
      {
        constraints: {
          custom: 'Description should be cannot exceed a maximum of 20 characters short.',
        },
      },
    ];
  }
};
