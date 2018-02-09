function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
	console.log("Hi");
    // files is a FileList of File objects. List some properties.
    var output = [];
	var file = files[0];
	
	output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
			  file.size, ' bytes, last modified: ',
			  file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
			  '</li>');

    document.getElementById('questions').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

document.getElementById('files').addEventListener('change', handleFileSelect, false);
