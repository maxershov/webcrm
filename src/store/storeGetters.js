import store from './store';

export function getPersonStore() {
  return store.getState().personsStore.data;
}

export function getDayDataStore() {
  return store.getState().dayStore.data;
}

export function getActivityStore() {
  return store.getState().activitiesStore.data;
}

export function getActivityStoreCode(codeTo) {
  const data = getActivityStore();
  return data.filter(obj => obj.code === codeTo );
}