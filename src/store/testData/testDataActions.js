import host from "../../../host";

export const requestPersons = () => {
  return { type: "REQUEST_PERSONS" };
};

export const getPersons = personsData => {
  return { type: "REQUEST_PERSONS_SUCCEEDED", data: personsData };
};

export const errorPersons = () => {
  return { type: "REQUEST_PERSONS_FAILED" };
};

export const fetchPersons = () => {
  return (dispatch) => {
  dispatch(requestPersons());
  fetch(`http://${host.host}:6700/getperson`)
    .then(res => res.json())
    .then(
      data => {
        dispatch(getPersons(data));
      },
      err => dispatch(errorPersons())
    );
  };
};
