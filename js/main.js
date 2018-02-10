import Docxtemplater from "docxtemplater"
import JSZip from "jszip"
import FileSaver from "file-saver"

var state = {templateData:{}};
var questionSpan = document.getElementById('questions');
var zip;
var templateFile;

function createQuestionHtml(question, index) {
	var questionHtml = `
	${question.question}: 
		<input type="radio" class="answer" id="choice1"
		 name="question${index}" value="${question.yesAnswer}">
		<label for="choice1">${question.yesAnswer}</label>

		<input type="radio" class="answer" id="choice2"
		 name="question${index}" value="${question.noAnswer}">
		<label for="choice2">${question.noAnswer}</label>
		<br>`
	
		return questionHtml;
}
function handleFileSelect(evt) { 
   // Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function (e) {
			
			console.log("Loading template")
			var questions = readQuestionsFromDoc(e.target.result);
			console.log(questions);
			questionSpan.innerHTML = questions.map((q, index) => createQuestionHtml(q, index)).join('')
			document.querySelectorAll('.answer').forEach(function(elem){
				elem.addEventListener('change',	handleAnswer, false);
			});

			console.log("Loaded template")
		}
		r.readAsBinaryString(f)
	} else {
		console.log("Error reading file")
	}
	
  }
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function handleAnswer(evt) {
	var radios = document.querySelectorAll("input[type=radio]");
	radios.forEach(function(r){
		//console.log(r.value + " " + r.checked)
		state.templateData[r.value] = r.checked
	})
	console.log(state)
}

function handleCreateClick(evt) {
	processDocument(zip)
}
document.getElementById('createDocument').addEventListener('click', handleCreateClick, false);
function readQuestionsFromDoc(file) {
	templateFile = file;
	zip = new JSZip(file);
	var data = zip.files["word/document.xml"]._data.getContent();
	var string = new TextDecoder("utf-8").decode(data);
	var xml = string,
	  xmlDoc = $.parseXML( xml ),
	  $xml = $( xmlDoc );
	var table = $xml.find('w\\:tbl,tbl').first();
	var rows = table.find('w\\:tr, tr');
	var questions = [];
	$.each(rows, function(key, row) {
		var elems = $(row).find('w\\:t, t')
		if(elems.length >= 3){
			questions.push({question: elems[0].textContent, yesAnswer: elems[1].textContent, noAnswer: elems[2].textContent})
		}
	});
	
	return questions;
}

function processDocument(zip){
	var doc = new Docxtemplater();
	doc.loadZip(new JSZip(templateFile)).setOptions({paragraphLoop:true})
	console.log(state.templateData);
	doc.setData(state.templateData);
	try {
		// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
		doc.render()
	}
	catch (error) {
		var e = {
			message: error.message,
			name: error.name,
			stack: error.stack,
			properties: error.properties,
		}
		console.log(JSON.stringify({error: e}));
		// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
		throw error;
	}
	var out=doc.getZip().generate({
            type:"blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) //Output the document using Data-URI
	FileSaver.saveAs(out,"output"+Date.now()+".docx")

}