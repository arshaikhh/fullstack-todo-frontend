import { useState } from "react";
import sortByDate from "./utils/sortDate";
interface ToDo {
  id: number;
  toDo: string;
  date: string;
}
export default function MainContent(): JSX.Element {
  const [id, setId] = useState(1);
  const [toDo, setToDo] = useState<ToDo[]>([]);
  const [checked, setChecked] = useState<ToDo[]>([]);

  const checkClick = (y: ToDo) => {
    setToDo(toDo.filter((x) => x !== y));
  };

  function handleClick(e: React.ChangeEvent<HTMLInputElement>, x: ToDo) {
    if (e.target.checked) {
      setChecked([...checked, x]);
    } else {
      setChecked(checked.filter((y) => y !== x));
    }
  }

  return (
    <div>
      <h2>Please input a TO-DO List Item</h2>
      <input id="myInput" type="text" />
      <button
        onClick={() => {
          const inputValue = (
            document.getElementById("myInput") as HTMLInputElement
          ).value;
          setId((x) => x + 1);
          setToDo([...toDo, { id: id, toDo: inputValue, date: Date() }]);
        }}
      >
        add ToDo
      </button>

      <ul>
        {toDo.sort(sortByDate).map((toDoItem) => (
          <li
            key={toDoItem.id}
            className={checked.includes(toDoItem) ? "checked" : "unchecked"}
          >
            <input type="checkbox" onChange={(e) => handleClick(e, toDoItem)} />{" "}
            {toDoItem.toDo}
            <button onClick={() => checkClick(toDoItem)} className="Remove">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
