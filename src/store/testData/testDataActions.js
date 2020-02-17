import host from "../../../host";

export const requestPersons = () => {
  console.log("requestPersons");
  return { type: "REQUEST_PERSONS" };
};

export const getPersons = personsData => {
  console.log("getPersons");
  return { type: "REQUEST_PERSONS_SUCCEEDED", data: personsData };
};

export const errorPersons = () => {
  console.log("fetchError");
  return { type: "REQUEST_PERSONS_FAILED" };
};

export const fetchPersons = () => {
  return (dispatch) => {
  dispatch(requestPersons());
  fetch(`http://${host.host}:6700/getperson`)
    .then(res => res.json())
    .then(
      data => {
        console.log(typeof data, data);
        dispatch(getPersons(data));
      },
      err => dispatch(errorPersons())
    );
  };
};
