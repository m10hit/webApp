function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

window.addEventListener("load", toLoad());

function toLoad() {
  bookList = []; // book list container
  getJsonObject('data.json',
    function(data) {
      bookList = data; // store the book list into bookList
      console.log(bookList); // print it into console (developer tools)
      console.log(bookList[0]); // print the first book object into console
      // here you can call methods to laod or refresh the page
      // loadBooks() or refreshPage()
      loadBooks(bookList);
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}

// Function to load books
function loadBooks(bookList) {

  var list = document.getElementById("listBox");
  var table = document.createElement("table");
  var tHead = document.createElement("thead");
  var sum=0;

  list.appendChild(table);
  table.appendChild(tHead);
  setAttributes(table, {"id":"bookTable"});

// to get headers in an array
  var col = [];
  for (var i = 0; i < bookList.length; i++) {
    for (var key in bookList[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  console.log(col);
arraymove(col,5,2);

// Function to change the position of array elements
  function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
console.log(col);

// Loop to create headers
  for (var i = 0; i < col.length; i++) {
    th = document.createElement("th");
    if (col[i] === "img" || col[i] === "rating") {
      th.innerText = "";
      tHead.appendChild(th);
      continue;
    }
    if (col[i] === "title") {
      th.setAttribute("colspan", "2");
    } else if (col[i] === "rating") {
      th.setAttribute("colspan", "1")
    }
    th.innerText = col[i];
    tHead.appendChild(th);
  }

// Loop to create the body part
  for (var i = 0; i < bookList.length; i++) {
    var tBody = document.createElement("tbody");
    for (var j = 0; j < col.length; j++) {
      var td = document.createElement("td");
      // console.log(bookList[i][col[j]]);
      // console.log(col[j]);
      if (col[j] === "img") { //condition to render image
        var tcheck = document.createElement("td");
        var check = document.createElement("input");
        setAttributes(check, {"type": "checkbox", "name": "check", "onclick":"checkOne(this)"});
        // check.setAttribute("type", "checkbox");
        // check.setAttribute("name", "check");
        // check.setAttribute("onclick","checkOne(this)");
        tcheck.appendChild(check);
        var image = document.createElement("img");
        image.src = bookList[i][col[j]];
        setAttributes(image, {"width": "35px", "height": "50px"});
        // image.setAttribute("width", "35px");
        // image.setAttribute("height", "50px");
        console.log(image);
        tBody.appendChild(tcheck);
        td.appendChild(image);
        tBody.appendChild(td);
        continue;
      } else if (col[j] === "rating") { //condition to render star ratings
        var star = document.createElement("img");
        star.src = "images/star-16.ico";
        var unstar = document.createElement("img");
        unstar.src = "images/outline-star-16.ico";
        // td.setAttribute("width","100px");
        setAttributes(td,{"width":"100px"});
        totRating = 5;
        emptyStar = totRating - parseInt(bookList[i][col[j]]);
        fullStar = totRating-emptyStar;

        for(var k=0; k<fullStar;k++){
          td.appendChild(star.cloneNode(true));
        }

        for(var k=0;k<emptyStar;k++){
           td.appendChild(unstar.cloneNode(true));
        }
        tBody.appendChild(td);
        continue;
      }else if(col[j] === "category"){
        setAttributes(td,{"class":"default"})
      }

      td.innerHTML = bookList[i][col[j]];
      tBody.appendChild(td);
    }
    table.appendChild(tBody);
  }
  document.getElementById("filter").addEventListener("click", selectCategory);
  document.getElementById("add-cart").addEventListener("click", function(){
    var isChecked = document.getElementsByName("check");
    console.log(isChecked);
    var isTicked = false;
    for(var i=0; i<isChecked.length;i++){
      if(isChecked[i].checked){
        var noOfBooks = prompt("Please enter the number of books");
        isTicked = true;
        if(isNaN(noOfBooks)){
          alert("Please enter an Integer");
          isChecked[i].checked = false;
          break;
        }
        console.log(noOfBooks);
        sum+=parseInt(noOfBooks);
        document.getElementsByTagName("p")[0].innerHTML = "(" +sum+")";
        isChecked[i].checked = false;
        break;
      }
    }
    if (isTicked === false){
      alert("Please select atleast one book");
    }
  });
  document.getElementById("reset-cart").addEventListener("click", function(){
    var isReset = confirm("Do you really want to Reset the cart?");
    if(isReset){
      sum=0;
      document.getElementsByTagName("p")[0].innerHTML = "(" +sum+")";
    }
  })
}



function checkOne(checks){
  console.log("hello")
  var checkboxes = document.getElementsByName("check");
  checkboxes.forEach((checkbox) => {
        if (checkbox !== checks) checkbox.checked = false
    })
}

function setAttributes(element, attributes) {
  for(var key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function selectCategory() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("category");
  filter = input.value.toUpperCase();
  table = document.getElementById("bookTable");
  tbody = table.getElementsByTagName("tbody");
  for (i = 0; i < tbody.length; i++) {
    td = tbody[i].getElementsByTagName("td")[8];
    if (td) {
      if(filter === "DEFAULT"){
        tbody[i].style.display = "";
      }else if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tbody[i].style.display = "";
      } else {
        tbody[i].style.display = "none";
      }
    }
  }
}
