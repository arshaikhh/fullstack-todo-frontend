import moment from "moment";
import { useState } from "react";
import sortByDate from "./utils/sortDate";
import dateComparison from "./utils/dateComparison";
import { useEffect } from "react";
import axios from "axios";

interface ToDo {
  id: number;
  toDo: string;
  creationDate: string;
  dueDate: string;
}
export default function MainContent(): JSX.Element {
  const requestUrl = "http://localhost:4000/items";

  // const [id, setId] = useState(1);
  const [toDo, setToDo] = useState<ToDo[]>([]);
  const [checked, setChecked] = useState<ToDo[]>([]);
  const [isDue, setIsDue] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<ToDo | null>();

  const currentDate = moment().format("YYYY-MM-DD");

  const removeClick = async (y: ToDo) => {
    const removeUrl = requestUrl + "/" + y.id;
    await axios.delete(removeUrl);
    const response = await fetch(requestUrl);
    const jsonBody = await response.json();

    setToDo(jsonBody);
  };

  function handleClick(e: React.ChangeEvent<HTMLInputElement>, x: ToDo) {
    if (e.target.checked) {
      setChecked([...checked, x]);
    } else {
      setChecked(checked.filter((y) => y !== x));
    }
  }

  function filterOverDue(x: ToDo) {
    if (isDue) {
      return dateComparison(currentDate, x.dueDate);
    } else {
      return x;
    }
  }

  const showDue = () => setIsDue(true);
  const showAll = () => setIsDue(false);

  function setItemClassName(toDoItem: ToDo): string {
    let str = "";
    checked.includes(toDoItem)
      ? (str = str + "checked")
      : (str = str + "unchecked");
    if (currentDate === toDoItem.dueDate) {
      str = str + " Today";
    } else if (
      dateComparison(toDoItem.dueDate, currentDate) === false &&
      toDoItem.dueDate !== ""
    ) {
      str = str + " due";
    }
    return str;
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(requestUrl);
      const jsonBody: ToDo[] = await response.json();
      setToDo(jsonBody);
    };
    fetchData();
  }, []);

  const postData = async (inputValue: string, due: string) => {
    await axios.post(requestUrl, {
      /*id: id,*/ toDo: inputValue,
      creationDate: Date(),
      dueDate: due,
    });
    const response = await fetch(requestUrl);
    const jsonBody = await response.json();

    setToDo(jsonBody);
  };

  const updateData = async (inputValue: string, id: number) => {
    const updatedUrl = requestUrl + "/" + id;
    await axios.patch(updatedUrl, {
      /*id: id,*/ toDo: inputValue,
    });

    const response = await fetch(requestUrl);
    const jsonBody = await response.json();

    setToDo(jsonBody);
  };

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
          postData(inputValue, due);
        }}
      >
        add ToDo
      </button>
      <hr />
      <button onClick={showDue}>Show OverDue Items Only</button>
      <button onClick={showAll}>Show All Items</button>
      <ul>
        {toDo
          .sort(sortByDate)
          .filter(filterOverDue)
          .map((toDoItem, id) => (
            <li key={id} className={setItemClassName(toDoItem)}>
              <input
                type="checkbox"
                onChange={(e) => handleClick(e, toDoItem)}
              />{" "}
              {toDoItem.toDo} &nbsp;&nbsp;|&nbsp;&nbsp; Due Date:{" "}
              {(toDoItem.dueDate === "" && "No Due Date Added") ||
                (currentDate === toDoItem.dueDate && "Today") ||
                (dateComparison(toDoItem.dueDate, currentDate) &&
                  toDoItem.dueDate) ||
                (dateComparison(toDoItem.dueDate, currentDate) === false &&
                  "Your To-Do item is overdue!")}
              <button
                onClick={() => {
                  itemToUpdate === toDoItem
                    ? setItemToUpdate(null)
                    : setItemToUpdate(toDoItem);
                  const inputValue = (
                    document.getElementById("updateText") as HTMLInputElement
                  ).value;
                  console.log(inputValue);
                  if (inputValue !== "") {
                    updateData(inputValue, toDoItem.id);
                    (
                      document.getElementById("updateText") as HTMLInputElement
                    ).value = "";
                  }
                }}
                className="Remove"
              >
                {" "}
                update
              </button>
              <input
                type={itemToUpdate === toDoItem ? "text" : "hidden"}
                id="updateText"
                placeholder="type in your update"
              />
              <button onClick={() => removeClick(toDoItem)} className="Remove">
                remove
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
