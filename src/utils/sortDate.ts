interface ToDo {
  id: number;
  toDo: string;
  date: string;
}
export default function sortByDate(a: ToDo, b: ToDo): number {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateA < dateB ? 1 : -1;
}
