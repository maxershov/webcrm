import React, { useState } from "preact/compat";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeNotes } from "../store/dayDataStore/dayDataActions";
import { chgProfileValue } from "../store/profileStore/profileActions";


const AreaNotes = props => {
  const { type, notesValue, date } = props;
  const [notesData, setNotesData] = useState(notesValue);
  const { codeLink } = useParams();
  const dispatch = useDispatch();

  const saveNotes = event => {
    if (event.key === "Enter" || event.target.id === "clickNotes") {
      if (type === "PERSON") {
        dispatch(chgProfileValue(codeLink, "notes", notesData));
      } else if (type === "DAY_DATA") {
        dispatch(changeNotes(date, notesData));
      }
    }
  };

  
  return (
    <>
      <label className="label">Заметки</label>
      <textarea
        className="notes"
        onChange={event => setNotesData(event.target.value)}
        onKeyDown={saveNotes}
        value={notesData}
      />
      <button className="button notes__button" type="button" id="clickNotes" onClick={saveNotes}>
        Сохранить
      </button>
    </>
  );
};


export default AreaNotes;