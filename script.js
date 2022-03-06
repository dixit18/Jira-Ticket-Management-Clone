let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color")

let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];



let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketArr = [];

if (localStorage.getItem("Jira_tickets")) {
    // retrieve and display tickets
    ticketArr = JSON.parse(localStorage.getItem("Jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        creatTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        // Display filterd tickets
        filteredTickets.forEach((ticketObj, idx) => {
            creatTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj, idx) => {
            creatTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })

    })
}

// listener for modal priority color
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border")
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];

    })
})


addBtn.addEventListener("click", (e) => {
    //    display modal
    // generate ticket

    // addFlag->true,display modal
    // addFlag->false,modal none

    addFlag = !addFlag
    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }

})
removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag
    console.log(removeFlag)


})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        creatTicket(modalPriorityColor, textareaCont.value);


        addFlag = false
        setModalDefault();

    }
})
// for doubleclick functionality
// modalCont.addEventListener("dblclick",(e)=>{

//         creatTicket();
//         modalCont.style.display ="none";
//         textareaCont.value = "";



// })

function creatTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class", "ticket-cont")
    ticketCont.innerHTML = `
      <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="task-area">${ticketTask} </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>

    `;
    // creat object of ticket and to arr
    if (!ticketID) {

        ticketArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("Jira_tickets", JSON.stringify(ticketArr))
    }

    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id) {
    // removeFlag  -> true->remove
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;

        let idx = getTicketIdx(id);
        // DB removal
        ticketArr.splice(idx, 1)
        let strTicketsArr = JSON.stringify(ticketArr);
        localStorage.setItem("Jira_tickets", strTicketsArr)
        ticket.remove()//UI removal

    })

}

function handleLock(ticket, id) {
    let ticketLockElem = document.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);

        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");

        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");

        }

        // modify data in localStorage
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("Jira_tickets", JSON.stringify(ticketArr));

    })
}


function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // get ticketIdx from the tickets array
        let ticketIdx = getTicketIdx(id);

        let currentTicketColor = ticketColor.classList[1];
        // get ticket color index
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        // modify data in local storage (Priority color change)
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("Jira_tickets", JSON.stringify(ticketArr))

    })





}
function getTicketIdx(id) {
    let ticketidx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketidx;
}

function setModalDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("border")
}