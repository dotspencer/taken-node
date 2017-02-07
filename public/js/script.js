// TODO: Buy domain link/mini-page
// TODO: Clean query value (php) or match for regex, if not, error
// TODO: Google analytics

// TODO: Allow for second search during loading

var input = document.querySelector('#in');
var results = document.querySelector('.results');
var title = document.querySelector('#title');
var message = document.querySelector('.message');

var tlds = ["com", "net", "org", "io", "info"];
var name = "";

var debug = false;

//var searching = false;

function bindEvents(){
  input.addEventListener('keypress', function(e){
    if(e.keyCode == 13){
      lookup();
    }
  });
  title.addEventListener('click', function(){
    clear();
    message.classList.remove('hidden');
    input.value = "";
    input.select();
  });
}

function clear(){
  // Clearing results
  results.innerHTML = "";
}

function sendRequests(name){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var response = xhr.responseText;
      receive(JSON.parse(response));
    }
  };
  xhr.open('GET', 'api?word=' + name);
  xhr.send();
}

function receive(result){
  var domains = result.domains;

  for(var i = 0; i < domains.length; i++){
    var domain = domains[i];
    var td = document.getElementById(domain.domain.split(".").pop());
    var status = domain.available ? "available" : "taken";
    td.innerHTML = status;
    td.classList.add(status);
  }
  input.removeAttribute('disabled');
  input.select();
}

function lookup(){

  name = input.value;
  name = sanitize(name);

  if(name.length > 0){
    input.setAttribute('disabled', '');
    input.value = name;

    sendRequests(name);
    createResultsTable(name);
  }
}

function createResultsTable(name){
  message.classList.add('hidden');
  clear();

  var table = document.createElement('table');
  var tbody = document.createElement('tbody');

  // Creating results element
  for(var i = 0; i < tlds.length; i++){
    var tld = tlds[i];

    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var spinner =  document.createElement('img');

    td1.innerText = name + "." + tld;
    td2.classList.add("status");
    td2.setAttribute('id', tld);

    spinner.classList.add('spin');
    spinner.setAttribute("src", "images/spin.gif");

    td2.appendChild(spinner);

    row.appendChild(td1);
    row.appendChild(td2);

    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  results.appendChild(table);
}

/**
 Applies the following changes to the string:
 - Makes lowercase
 - Removes characters that do not match a-z, 0-9, or '-'
**/
function sanitize(text){
  // Lowercase
  text = text.toLowerCase();

  // Removes tld ending if found in tld array
  text = removeAnyPossibleEnding(text, tlds);

  // Character only matches if a-z or 0-9
  var array = text.split('');
  array = array.map(function(s){
    var matches = s.match(/^[a-z0-9-]$/i) != null;
    if(matches){
      return s;
    }
    return "";
  });
  return array.join('');
}

/**
 Removes any (one) of the possible tld substrings from the end of the string
**/
function removeAnyPossibleEnding(text, array){
  for (var i = 0; i < array.length; i++) {
    var before = text;
    var after = removeFromEnd(text, "." + array[i]);

    // Break if text was modified. Only removes one tld.
    if(before != after){
      return after;
    }
  }
  return text;
}

function removeFromEnd(text, end){
  var indexWithin = text.indexOf(end);
  if(indexWithin == -1){
    return text;
  }
  var wouldBeEndIndex = text.length - end.length;
  var endsWith = indexWithin == wouldBeEndIndex;

  if(endsWith){
    return text.substring(0, wouldBeEndIndex);
  }
  return text;
}

bindEvents();
input.select();
