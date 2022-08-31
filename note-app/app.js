const yargs = require("yargs");
const notes = require("./note.js");

yargs
  .command(
    "add",
    "add new note",
    (yargs) =>
      yargs.options({
        title: {
          alias: "a",
          default: "no title",
          describe: "Note's name",
          type: String,
        },
        time: {
          alias: "b",
          default: "no time",
          describe: "Note's time",
          type: String,
        },
      }),
    (argv) => notes.add(argv.title, argv.time)
  )
  .command(
    "remove",
    "remove a note",
    (yargs) =>
      yargs.options({
        title: {
          alias: "a",
          default: "no title",
          describe: "Note's name",
          type: String,
        },
      }),
    (argv) => notes.remove(argv.title)
  ).argv;
