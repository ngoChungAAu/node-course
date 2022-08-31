const fs = require("fs");

const loadNotes = () => {
  try {
    const rawData = fs.readFileSync("notes.json");

    return JSON.parse(rawData.toString());
  } catch (error) {
    return [];
  }
};

const saveNotes = (data) => {
  const jsonData = JSON.stringify(data);

  fs.writeFileSync("notes.json", jsonData);
};

const addNote = (title, time) => {
  const notes = loadNotes();

  const isExist = notes.filter((item) => item.title === title);

  if (isExist.length === 0) {
    notes.push({ title, time });

    saveNotes(notes);

    console.log("Added");
  } else {
    console.log("Duplicate");
  }
};

const removeNote = (title) => {
  const notes = loadNotes();

  const index = notes.findIndex((item) => item.title === title);

  if (index > -1) {
    notes.slice(index, index + 2);

    saveNotes(notes);

    console.log("Removed %s", title);
  } else {
    console.log("Not found");
  }
};

module.exports = {
  add: addNote,
  remove: removeNote,
};
