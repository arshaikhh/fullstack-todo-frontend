import moment from "moment";
import { useState } from "react";
import sortByDate from "./utils/sortDate";
import dateComparison from "./utils/dateComparison";

interface ToDo {
  id: number;
  toDo: string;
  creationDate: string;
  dueDate: string;
}
export default function MainContent(): JSX.Element {
  const [id, setId] = useState(1);
  const [toDo, setToDo] = useState<ToDo[]>([]);
  const [checked, setChecked] = useState<ToDo[]>([]);

  const currentDate = moment().format("YYYY-MM-DD");

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

  function filterOverDue() {
    setToDo(toDo.filter((x) => dateComparison(currentDate, x.dueDate)));
  }

  return (
    <div>
      <h2>Please input a TO-DO List Item</h2>
      <label>
        {" "}
        ToDo Item <input id="myInput" type="text" />{" "}
      </label>
      &nbsp;&nbsp;
      <label>
        {" "}
        DueDate{" "}
        <input type="date" id="dueDate" data-date-inline-picker="true" />
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button
        onClick={() => {
          const inputValue = (
            document.getElementById("myInput") as HTMLInputElement
          ).value;
          const due = (document.getElementById("dueDate") as HTMLInputElement)
            .value;
          setId((x) => x + 1);
          setToDo([
            ...toDo,
            { id: id, toDo: inputValue, creationDate: Date(), dueDate: due },
          ]);
        }}
      >
        add ToDo
      </button>
      <hr />
      <button onClick={filterOverDue}>Show OverDue Items Only</button>
      <ul>
        {toDo.sort(sortByDate).map((toDoItem) => (
          <li
            key={toDoItem.id}
            className={
              (checked.includes(toDoItem) ? "checked" : "unchecked") +
              (currentDate === toDoItem.dueDate && " Today") +
              (dateComparison(toDoItem.dueDate, currentDate) === false &&
                toDoItem.dueDate !== "" &&
                " due")
            }
          >
            <input type="checkbox" onChange={(e) => handleClick(e, toDoItem)} />{" "}
            {toDoItem.toDo} &nbsp;&nbsp;|&nbsp;&nbsp; Due Date:{" "}
            {(toDoItem.dueDate === "" && "No Due Date Added") ||
              (currentDate === toDoItem.dueDate && "Today") ||
              (dateComparison(toDoItem.dueDate, currentDate) &&
                toDoItem.dueDate) ||
              (dateComparison(toDoItem.dueDate, currentDate) === false &&
                "Your To-Do item is overdue!")}
            <button onClick={() => checkClick(toDoItem)} className="Remove">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
