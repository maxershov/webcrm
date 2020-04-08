import store from './store';

export function getPersonStore() {
  return store.getState().personsStore.data;
}

export function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
};