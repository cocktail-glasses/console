import { useAtom } from 'jotai';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Todo, TodoItem } from './todo.ts';
import { atom } from 'jotai';
import { validate } from 'class-validator';

type TodoRegisterDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const todoListAtom = atom<Todo[]>([]);
export const todoAtom = atom<TodoItem>(new TodoItem());
export const validationErrorsAtom = atom<Record<string, string>>({});
export const todoDescriptionAtom = atom<string>('');
export const todoDeadlineAtom = atom<Date>(new Date());
export const todoPriorityAtom = atom<number>(1);

export default function TodoRegisterDialog({ open, onClose }: TodoRegisterDialogProps) {
  const [todos, setTodos] = useAtom(todoListAtom);
  const [todo, setTodo] = useAtom(todoAtom);
  const [_, setValidationErrors] = useAtom(validationErrorsAtom);
  const [todoDescription] = useAtom(todoDescriptionAtom);
  const [todoDeadline] = useAtom(todoDeadlineAtom);
  const [todoPriority] = useAtom(todoPriorityAtom);

  const close = () => {
    setTodo(new TodoItem());
    onClose();
  };

  const handleRegister = async () => {
    // Get datas
    todo.description = todoDescription;
    todo.deadline = todoDeadline;
    todo.priority = todoPriority;

    console.log(`REGISTER > ${JSON.stringify(todo)}`);

    // 기본 Entity Validation
    const vErrors = await validate(todo);
    const errorMessages: Record<string, string> = {};
    vErrors.forEach((error) => {
      if (error.constraints) {
        const messages = Object.values(error.constraints);
        if (messages.length > 0) {
          errorMessages[error.property] = messages[0];
        }
      }
    });

    // 커스텀 Entity Validation - Custom
    todo.validate(errorMessages);

    if (Object.keys(errorMessages).length > 0) {
      setValidationErrors(errorMessages);
      console.log(`ERRORS > ${JSON.stringify(errorMessages)}`);
      return;
    }

    todo.setId(todos.length === 0 ? String(1) : String(Number((todos.slice(-1) as unknown as Todo).id) + 1));
    console.log(`REGISTER > ${JSON.stringify(todo)}`);
    setTodos([...todos, todo]);
    close();
  };

  const handleClose = () => {
    close();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle>작업 등록</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          종료
        </Button>
        <Button onClick={handleRegister} color="primary">
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
