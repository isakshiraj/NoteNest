//DOM selectors
showNotes();
const addbtn = document.getElementById("addBtn");
const done = document.getElementById("editBtn");
const addtext = document.getElementById("addTxt");
const searchTxt = document.getElementById("searchTxt");
const heading = document.getElementById("heading");
const volumeButton = document.getElementById("mute-button");
const styledMessageContainer = document.getElementById("styled-message-container");
let styledTitle = document.getElementById("styled-title");
done.style.visibility = "hidden";
//Event listeners
addbtn.addEventListener("click", addaNote);
searchTxt.addEventListener("keypress", function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
      searchtext();
  }
});

//Functions
// let notesArray=[]
function showNotes(searchTerm="") {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesArray = [];
  } else {
    notesArray = JSON.parse(notes);
  }

  let filteredNotes = notesArray.filter(function (element) {
    let cardTitle = element[0].toLowerCase();
    let cardTxt = element[1].toLowerCase();

    return cardTitle.includes(searchTerm) || cardTxt.includes(searchTerm);
  });
  console.log(filteredNotes);
  console.log(searchTerm);
  let html = "";
  filteredNotes.forEach(function (element, index) {
    html += `
      <div class="noteCard my-2 card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${element[0]}</h5>
          <p class="card-text"> ${element[1]}</p>
          <button id="${index}" onclick="editNote(this.id)" class="btn btn-primary">Edit</button>
          <button id="${index}" onclick="deleteNote(this.id)" class="btn btn-primary">Delete</button>
        </div>
      </div>`;
  });

  let notesElm = document.getElementById("notes");
  if (filteredNotes.length !== 0) {
    notesElm.innerHTML = html;
  } else {
    notesElm.innerHTML = `No matching notes found. Use "Add a Note" section to add notes.`;
  }

  notesElm.style.color = "rgb(115, 115, 115)";
  notesElm.style.fontSize = "20px";
}

function addaNote() {
  const audio = document.querySelector(".sound");

  const notes = localStorage.getItem("notes");
  if (notes == null) {
    notesArray = [];
  } else {
    notesArray = JSON.parse(notes);
  }
  let useDefaultTitle = document.getElementById("useDefaultTitle").checked;
  if (addtext.value !== "") {
    if (heading.value === "" && useDefaultTitle){
      let title = getDefaultTitle(addtext.value);
      notesArray.push([title, addtext.value]);
      localStorage.setItem("notes", JSON.stringify(notesArray));
      addtext.value = "";
      heading.value = "";
      $(".toast").toast("show");
    if (volumeButton.classList.contains('fa-volume-up')) {
      audio.play();
    }
     }
     else if(heading.value === "" && !useDefaultTitle){
      styledTitle.innerHTML =
        '<div class="alert alert-warning" role="alert" style="background: #b5f2fb;">Title cannot be empty! Please enter a title or check the below box for default title</div>';
      setTimeout(() => {
        styledTitle.innerHTML = "";
      }
      , 4000);
     }
     else {
       let title = heading.value;
       notesArray.push([title, addtext.value]);
       localStorage.setItem("notes", JSON.stringify(notesArray));
       addtext.value = "";
       heading.value = "";
       $(".toast").toast("show");
    if (volumeButton.classList.contains('fa-volume-up')) {
      audio.play();
    }
     } 
    
  } else {
      styledMessageContainer.innerHTML =
        '<div class="alert alert-warning" role="alert">Notes cannot be empty!</div>';
      setTimeout(() => {
        styledMessageContainer.innerHTML = "";
      }
      , 2000);
     
  }
  showNotes();
}
// Function to get default title from the first two words of text
function getDefaultTitle(text) {
  let words = text.split(" ");
  return words.length >= 2 ? `${words[0]} ${words[1]}` : text;
}

function editNote(index) {
  addbtn.style.visibility = "collapse";
  done.style.visibility = "visible";
  const notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }

  heading.value = notesObj[index][0].replace(/ \(Edited\) .*/, '');
  addtext.value = notesObj[index][1];

  done.onclick = () => {
    const updatedHeading = heading.value.trim(); // Trim leading and trailing spaces
    const updatedAddText = addtext.value.trim(); // Trim leading and trailing spaces

    if (!updatedAddText) {
      window.alert("Note cannot be empty. Your item will be deleted.");
      notesObj.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notesObj));
      showNotes();
    } else {
      let headingString = updatedHeading;

      // Check if "Use Default Title" option is checked
      if (document.getElementById("useDefaultTitle").checked) {
        // Use the first two words of addtext as the title
        const words = updatedAddText.split(" ");
        headingString = words.length >= 2 ? `${words[0]} ${words[1]}` : updatedHeading;
      }

      // Check if heading is not empty before appending "(Edited) " + " " + n
      if (headingString) {
        headingString += " (Edited) " + new Date().toLocaleTimeString();
        const update = [headingString, updatedAddText];

      notesObj.splice(index, 1, update);
      localStorage.setItem("notes", JSON.stringify(notesObj));
      showNotes();
      heading.value = "";
      addtext.value = "";
      addbtn.style.visibility = "visible";
      done.style.visibility = "hidden";
      } 
      else {
        // Heading is empty, show an alert message
        window.alert("Heading cannot be empty.");
      }
    }
  };
}



function deleteNote(index) {
  //   console.log("I am deleting", index);

  const notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }

  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}
function searchtext() {
  let inputVal = searchTxt.value.toLowerCase();

  const cardy=document.getElementsByClassName("card");
  for (let i = 0; i < cardy.length; i++) {
    cardy[i].style.display = "none";
  }
  let heading = document.querySelector("h1");
  if (heading) {
    heading.style.display = "none";
  }
  showNotes(inputVal);
}

// theme change function

// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-light");
  } else {
    setTheme("theme-dark");
  }
}

// Immediately invoked function to set the theme on initial load
(function () {
  if (localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-dark");
    document.getElementById("slider").checked = false;
  } else {
    setTheme("theme-light");
    document.getElementById("slider").checked = true;
  }
})();

function toggleMute() {
  if (volumeButton.classList.contains("fa-volume-mute")) {
    volumeButton.classList.remove("fa-volume-mute");
    volumeButton.classList.add("fa-volume-up");
  } else {
    volumeButton.classList.remove("fa-volume-up");
    volumeButton.classList.add("fa-volume-mute");
  }
}
document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("scroll", function() {
      var scrollY = window.scrollY || document.documentElement.scrollTop;

      if (scrollY > 200) {
          document.querySelector('.scroll-up-btn').classList.add("show");
      } else {
          document.querySelector('.scroll-up-btn').classList.remove("show");
      }
  });

  document.querySelector('.scroll-up-btn').addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
