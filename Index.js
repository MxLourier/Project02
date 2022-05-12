const fs = require("fs");
const {
  parse
} = require("csv-parse");
const fetch = require('node-fetch');

async function download(url, name) {
  const response = await fetch(url); // response is http object
  const type = response.headers.get('content-type');
  console.log(type);
  const buffer = await response.buffer(); // buffer is async; buffer is body of the response
  if (type === "application/pdf") {
    console.log("type is pdf");
    fs.writeFile("./"+name+".pdf", buffer, () =>
      console.log('finished downloading!'));
  } else {
    console.log("type is html");
    fs.writeFile("./"+name+".html", buffer, () =>
      console.log('finished downloading!'));
  }
}

fs.createReadStream("./URLs.csv") //read URL.csv file
  .pipe(parse({
    delimiter: ",",
    from_line: 2
  }))
  //pipe forwards chunks of data from readstream to another stream
  //parse creates second stream - transform stream (write and read)
  //takes a data chunk and tranforms it to another form (array)
  .on("data", function(row) {
    console.log(row);
    // Logs an array of objects, each object consists of title and url
    var name = row[0];
    var url = row[1];
    //console.log("row")
    //console.log(name+".html");
    //console.log(url);
    download(url, name);

  })
