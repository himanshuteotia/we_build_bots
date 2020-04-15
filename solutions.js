
// --------------- part 1 ----------------------------------------

const fs = require('fs');
const es = require('event-stream');
const pathText = "./data/oliver-twist.txt";
const pathNames = "./data/first-names.txt";
let namesDict = {}

// to maintain the count in a dictonary
function setNamesWithCounts(arr = []) {
	if (!arr) return;
	for (let i = 0; i < arr.length; i++) {
		if (namesDict[arr[i]]) {
			namesDict[arr[i]]++;
		} else {
			namesDict[arr[i]] = 1
		}
	}
}

// to sort the dictonaries keys on the basis of their respective values 
function sortProperties(obj) {
	// convert object into array
	var sortable = [];
	for (var key in obj)
		if (obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]

	// sort items by value
	sortable.sort(function (a, b) {
		return b[1] - a[1]; // compare numbers
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function run() {
	try {
		console.log("Starting the process...")
		let names = fs.readFileSync(pathNames).toString().split('\r').join("|"); // read all the names from given file and join with '|'
		let expression = "\\b" + "(" + names + ")" + "\\b" // creating a regex with word boundries
		let regexOfNames = new RegExp(expression, "gm")
		fs.createReadStream(pathText)
			.pipe(es.split()) //split stream to break on newlines
			.pipe(es.mapSync(function (line) { //turn this sync function into a stream
				setNamesWithCounts(line.match(regexOfNames))
			}).on("error", (err) => {
				console.log("error while reading file", err)
			}).on("end", () => {
				sortedValues = sortProperties(namesDict)
				var file = fs.createWriteStream('names.txt'); // to write the names in a 'names.txt' file
				file.on('error', function (err) { console.log("error while writing file", err) });
				sortedValues.forEach(function (v) { file.write(v.join(' ') + '\n'); }); // process line by line 
				file.end();
				console.log("Sucessfully finished!")
			}))
	} catch (error) {
		console.log(error)
	}
}
run()

// --------------- part 2 ----------------------------------------

module.exports = app => {
	app.get("/:name",function(req,res){
		try {
			res.json({"name" : req.params['name'] , "count" : namesDict[req.params['name']] || 0 })
		} catch (error) {
			res.json({ "error_message" : error.message })
		}
	})
}





