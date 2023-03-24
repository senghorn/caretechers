import config from '../../constants/config';
const axios = require('axios').default;

export async function UpdateNote(updated_note, cookie) {
  try {
    let connection_string = config.backend_server + '/notes/' + updated_note.id;
    await axios
      .patch(connection_string, {
        title: updated_note.title,
        content: updated_note.content,
      }, {
        headers: { 'Authorization': 'Bearer ' + cookie }
      })
      .then((response) => {
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

/**
 * Sends a request to remove the provided noteId's note
 * @param {string} noteId 
 * @returns 
 */
export async function RemoveNote(noteId, cookie) {
  try {
    let connection_string = config.backend_server + '/notes/' + noteId;
    await axios.delete(connection_string, {
      headers: {
        'Authorization': 'Bearer ' + cookie
      }
    })
      .then((response) => { })
      .catch((error) => {
        console.log('delete note error', error);
      });
  } catch (error) {
    console.log(error.message);
  }
}


/**
 * Saves the new note created by send the request to the server.
 * @param {object} newNote 
 * @param {string} group_id 
 * @returns 
 */
export async function CreateNote(newNote, group_id, cookie) {
  try {
    let connection_string = config.backend_server + '/notes/group/' + group_id;
    const result = await axios.post(connection_string, newNote, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookie
      },
      params: {
        groupId: group_id
      }
    });
    const data = result.data;
    return data.noteId;
  } catch (error) {
    console.log("Can't create new note", error.message);
    return null;
  }
}


/**
 * Returns the result of searching. Returns null if fail.
 * @param {string} search_string 
 * @param {string} group_id 
 * @returns 
 */
export async function SearchNotes(search_string, group_id) {
  try {
    let url =
      config.backend_server + `/notes/search/${group_id}/${search_string}`;
    const result = await fetch(url);
    const data = await result.json();
    return data;
  } catch (error) {
    console.log('Search note threw an error: ', error.message);
    return null;
  }
}
