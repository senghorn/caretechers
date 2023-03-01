import config from '../../constants/config';

const axios = require('axios').default;

export async function UpdateNote(updated_note) {
  try {
    let connection_string = config.backend_server + '/notes/' + updated_note.id;
    await axios
      .patch(connection_string, {
        title: updated_note.title,
        content: updated_note.content,
      })
      .then((response) => {
        // console.log(response.data);
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }

  return false;
}

export async function fetchNotes(user, setNotes) {
  try {
    let connection_string =
      config.backend_server + '/notes/group/' + user.group_id;
    await axios.get(connection_string).then(function (response) {
      setNotes(response.data);
    });
  } catch (error) {
    console.log('Fetching note error', error.message);
  }
}

export async function RemoveNote(noteId) {
  try {
    let connection_string = config.backend_server + '/notes/';
    axios
      .delete(connection_string + noteId)
      .then((response) => { })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

// Sends the new added note to backend
export async function CreateNote(newNote, group_id) {
  try {
    let connection_string = config.backend_server + '/notes/group/' + group_id;
    const result = await fetch(connection_string, {
      method: 'POST',
      body: JSON.stringify(newNote),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await result.json();
    return data.noteId;
  } catch (error) {
    console.log("Can't create new note", error.message);
    return null;
  }
}


export async function SearchNotes(search_string, group_id) {

  try {
    let url = config.backend_server + `/notes/search/${group_id}/${search_string}`;
    const result = await fetch(url);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("Search note threw an error: ", error.message);
    return null;
  }
}