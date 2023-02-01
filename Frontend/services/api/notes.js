import config from "../../constants/config";

const axios = require("axios").default;

export async function UpdateNote(updated_note) {
    try {
        let connection_string = "http://" + config.backend_server + "/notes/" + updated_note.id;
        await axios.patch(connection_string, {
            title: updated_note.title,
            content: updated_note.content
        }).then(response => {
            // console.log(response.data);
            return true;
        }).catch(error => {
            console.log(error);
        });
    } catch (error) {
        console.log(error.message);
    }

    return false;
}

export async function RemoveNote(noteId) {
    try {
        let connection_string = "http://" + config.backend_server + "/notes/";
        axios.delete(connection_string + noteId)
            .then(response => {
            })
            .catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log(error.message);
    }
}

// Sends the new added note to backend
export async function CreateNote(newNote, group_id) {
    try {
        console.log(group_id);
        let connection_string =
            "http://" + config.backend_server + "/notes/group/" + group_id;
        const result = await fetch(connection_string, {
            method: "POST",
            body: JSON.stringify(newNote),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await result.json();
        return (data.noteId);
    } catch (error) {
        console.log("Can't create new note", error.message);
        return null;
    }
};