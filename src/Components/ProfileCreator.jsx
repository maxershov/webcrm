import { h } from "preact";
import { memo, useState } from 'preact/compat';
import { useDispatch } from "react-redux";
import { addNewProfile } from "../store/profileStore/profileActions";



const ProfileCreator = memo(props => {
  const dispatch = useDispatch();

  function createProfile(codeTo) {
    // code.replace handle in backend => i need name for profile with spaces
    dispatch(addNewProfile(codeTo));
    // open user page with new profile
    props.route.push(`/profile/${codeTo.replace(/ /g, '')}`)
  }

  const [code, setCode] = useState('');

  const enterCode = (event) => {
    event.preventDefault();
    const codeSaved = code;
    setCode(''); // clear codeField
    createProfile(codeSaved);
  }

  return (
    <div className="profile-creator">
      <label className="label">Создать профиль</label>
      <form className="code-form" name="codeForm" onSubmit={enterCode}>
        <input className="input code-form__input" required minLength={4} placeholder=" Введите данные" type="text" name="PROFILE" onChange={event => setCode(event.target.value.trim())} value={code} />
        <button className="input code-form__button" type="submit">СОЗДАТЬ</button>
      </form>
    </div >
  );
});


export default ProfileCreator;