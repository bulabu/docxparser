import Docxtemplater from "docxtemplater"
import JSZip from "jszip"

class InspectModule {
	constructor() {
		this.inspect = {};
		this.fullInspected = {};
		this.filePath = null;
	}
	set(obj) {
		if (obj.inspect) {
			if (obj.inspect.filePath) {
				this.filePath = obj.inspect.filePath;
			}
			this.inspect = Object.assign(this.inspect, obj.inspect);
			this.fullInspected[this.filePath] = this.inspect;
		}
	}
}

var state = {};
function handleFileSelect(evt) {
   // Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function (e) {
			console.log("Loading template")
			readQuestionsFromDoc(e.target.result);
			console.log("Loaded template")
		}
		r.readAsBinaryString(f)
	} else {
		console.log("Error reading file")
	}
	
  }
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function readQuestionsFromDoc(file) {
	setProcessingTemplate();
	var zip = new JSZip(file);
	var data = zip.files["word/document.xml"]._data.getContent();
	var string = new TextDecoder("utf-8").decode(data);
	var xml = string,
	  xmlDoc = $.parseXML( xml ),
	  $xml = $( xmlDoc );
	console.log($xml)
	var table = $xml.find('w\\:tbl,tbl').first();
	console.log(table);
	var rows = table.find('w\\:tr, tr');
	console.log(rows);
	var questions = [];
	$.each(rows, function(key, row) {
		debugger;
		var elems = $(row).find('w\\:t, t')
		if(elems.length === 3){
			questions.push({question: elems[0].textContent, yesAnswer: elems[1].textContent, noAnswer: elems[2].textContent})
		}
	});
	console.log(questions);
	
	return questions;
}

function setProcessingTemplate(){
	
}