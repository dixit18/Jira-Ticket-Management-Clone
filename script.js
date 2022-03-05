let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont")
let mainCont = document.querySelector(".main-cont")
let textareaCont = document.querySelector(".textarea-cont")
let addFlag = false;


addBtn.addEventListener("click",(e)=>{
//    display modal
// generate ticket

// addFlag->true,display modal
// addFlag->false,modal none

    addFlag = !addFlag
   if(addFlag){
        modalCont.style.display = "flex";
   }else{
        modalCont.style.display ="none";
   }

})

modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key === "Shift"){
        creatTicket();
        modalCont.style.display ="none";
        addFlag=false
        textareaCont.value = "";
    

    }
})
// for doubleclick functionality
// modalCont.addEventListener("dblclick",(e)=>{
   
//         creatTicket();
//         modalCont.style.display ="none";
//         textareaCont.value = "";
    

    
// })

function creatTicket(){
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class", "ticket-cont")
    ticketCont.innerHTML = `
      <div class="ticket-color"></div>
            <div class="ticket-id">#b5fsgj598</div>
            <div class="task-area">
            Lorem ipsum dolor sit,    amet consectetur adipisicing elit. Ab omnis cum quod saepe perspiciatis aut, vero doloremque doloribus quis neque.
            </div>

    `;
    mainCont.appendChild(ticketCont);
}