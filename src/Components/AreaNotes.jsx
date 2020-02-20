import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChangeProfileValue, addNewDayDataToJSON } from "../App";


const AreaNotes = props => {
  const { notesValue, type, dayObject } = props;
  const [notesData, setNotesData] = useState(notesValue);
  const { codeLink } = useParams();
  console.log("in notes", dayObject);
  const saveNotes = event => {
    // console.log('in notes', dayObject);
    if (event.key === "Enter" || event.target.id === "clickNotes") {
      if (type === "PERSON") {
        ChangeProfileValue(codeLink, notesData, "notes");
      } else if (type === "DAY_DATA") {
        dayObject.notes = notesData;
        addNewDayDataToJSON(dayObject);
      }
    }
  };
  useEffect(() => {
    if (notesValue === undefined) setNotesData("");
    else setNotesData(notesValue);
  }, [notesValue]);

  return (
    <>
      <textarea
        onChange={event => setNotesData(event.target.value)}
        onKeyDown={saveNotes}
        value={notesData}
      />
      <button type="button" id="clickNotes" onClick={saveNotes}>
        Изменить
      </button>
    </>
  );
};


export default AreaNotes;
