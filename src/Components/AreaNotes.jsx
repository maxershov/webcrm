import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeNotes } from "../store/dayDataStore/dayDataActions";
import { chgProfileValue } from "../store/profileStore/profileActions";
import Spinner from './Spinner';

const AreaNotes = props => {

// notes value 
// date value
const notesValue = useSelector(state => state.dayStore.data.notes);
const loadingDays = useSelector(state => state.dayStore.loading);
console.log('USESELECTOR', notesValue)
console.log('loading', loadingDays.toString());

const date = useSelector(state => state.dayStore.data.date);
console.log('USESELECTOR', date)
  // const { notesValue, type, date } = props;
  const { type} = props;

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

  // return (
    return !loadingDays ? (
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
  )    : <Spinner />;
};


export default AreaNotes;




// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { changeNotes } from "../store/dayDataStore/dayDataActions";
// import { chgProfileValue } from "../store/profileStore/profileActions";
// import Spinner from './Spinner';

// const AreaNotes = props => {

// // notes value 
// // date value
// const notesValue = useSelector(state => state.dayStore.data.notes);
// const date = useSelector(state => state.dayStore.data.date);
// const loadingDays = useSelector(state => state.dayStore.loading);
//   // const { notesValue, type, date } = props;
//   const { type} = props;

//   const [notesData, setNotesData] = useState(notesValue);
//   const { codeLink } = useParams();
//   const dispatch = useDispatch();

//   const saveNotes = event => {
//     if (event.key === "Enter" || event.target.id === "clickNotes") {
//       if (type === "PERSON") {
//         dispatch(chgProfileValue(codeLink, "notes", notesData));
//       } else if (type === "DAY_DATA") {
//         dispatch(changeNotes(date, notesData));
//       }
//     }
//   };

//   // return (
//     return !loadingDays ? (
//       <>
//         <textarea
//           onChange={event => setNotesData(event.target.value)}
//           onKeyDown={saveNotes}
//           value={notesData}
//         />
//         <button type="button" id="clickNotes" onClick={saveNotes}>
//           Изменить
//         </button>
//       </>
//   )    : <Spinner />;
// };


// export default AreaNotes;