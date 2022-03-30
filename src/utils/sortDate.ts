interface ToDo {
  id: number;
  toDo: string;
  creationDate: string;
  dueDate: string;
}
export default function sortByDate(a: ToDo, b: ToDo): number {
  const dateA = new Date(a.creationDate).getTime();
  const dateB = new Date(b.creationDate).getTime();
  return dateA < dateB ? 1 : -1;
}
