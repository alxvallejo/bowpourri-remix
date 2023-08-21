const apiUrl = 'http://localhost:8080';

export const fetchMyNotes = async () => {
  const url = apiUrl + '/notes';
  const resp = await fetch(url);
};
