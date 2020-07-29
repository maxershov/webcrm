import React, { useState } from 'preact/compat';
import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { chgProfileValue, addNewProfile } from "../store/profileStore/profileActions";
import { addToVisits } from "../store/activitiesDataStore/activitiesDataActions";


const CodeScanner = React.memo(props => {
  const personData = useSelector(state => state.personsStore.data);
  const historyData = useSelector(state => state.activitiesStore.data);
  const dispatch = useDispatch();
  const [disBtn, setDisBtn] = useState(false);


  function subtractOneRemain(codeTo, index) {
    const person = personData[index];
    if (Number.isInteger(person.remain)) {
      dispatch(chgProfileValue(codeTo, 'remain', (person.remain - 1)));
      return `УЧЁТ ${person.remain} => ${(person.remain - 1)}`;
    } return "";
  }


  function handleNewCode(codeTo) {
    // find if in today history
    codeTo = codeTo.replace(/ /g, '');
    const indexHistory = historyData.findIndex(person => person.code === codeTo);
    let amount = "";
    if (indexHistory === -1) {
      // find if in persons => if not => create new profile and add to history
      const indexPerson = personData.findIndex(person => person.code === codeTo);
      if (indexPerson === -1) dispatch(addNewProfile(codeTo));
      else amount = subtractOneRemain(codeTo, indexPerson);

      dispatch(addToVisits(codeTo, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), amount));
    }
  }

  function checkPi() {
    setDisBtn(true);
    setTimeout(() => setDisBtn(false), 15000);
    const timer = setTimeout(() => alert('Ошибка! Проверьте подключение'), 10000);
    fetch(`http://192.168.1.150:6700/connectPi/${window.location.host}`).then(res => res.json()).then(data => {
      alert("Подключено")
      clearTimeout(timer)
    });
  }

  const [code, setCode] = useState('');

  const enterCode = (event) => {
    event.preventDefault();
    const codeSaved = code;
    setCode(''); // clear codeField
    handleNewCode(codeSaved);
  }

  return (
    <div className="code-scanner">
      <label className="label">Сканер карт
        <button className="code-scanner__button" disabled={disBtn} type="button" onClick={checkPi}>ПОДКЛЮЧЕНИЕ</button>
      </label>
      <form name="codeForm" onSubmit={enterCode}>
        <input className="input" required minLength={1} placeholder=" Введите данные" type="text" name="SCANNER" onChange={event => setCode(event.target.value.trim())} value={code} />
      </form>
    </div>
  );
});


export default CodeScanner;