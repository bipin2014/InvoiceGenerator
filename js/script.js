const table = document.querySelector(".table");

// let list = [{ id: 1, name: "test", price: 10, quantity: 10 }];
let list = [];
let historyArray = [];
let ascending = true;
let invoiceMessage = document.querySelector("#invoiceMessage");
let historyHeading = document.querySelector("#history-heading");

invoiceMessage.textContent =
  "No Item added Yet. Add it to see a list of item here";

let totalInfo = document.querySelector("#total-info");
let sortButtons = document.querySelector(".sort-buttons");
let formArea = document.querySelector(".form-area");
let index;
let deleteId;
formArea.classList.add("hide");
totalInfo.classList.add("hide");
sortButtons.classList.add("hide");

//add Item Form
const form = document.querySelector("#addform");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log(isNaN(event.target.price.value));

  if (event.target.name.value === "") {
    buildMessage({ message: "Name Cannot be Empty" });
  } else if (
    isNaN(event.target.price.value) ||
    event.target.price.value === ""
  ) {
    buildMessage({ message: "Price must be number" });
  } else if (event.target.price.value <= 0) {
    buildMessage({ message: "Price must be greater than 0" });
  } else if (
    isNaN(event.target.quantity.value) ||
    event.target.quantity.value === ""
  ) {
    buildMessage({ message: "Quantity must be number" });
  } else if (event.target.quantity.value <= 0) {
    buildMessage({ message: "Qunatity must be greater than 0" });
  } else {
    let id;
    if (list.length > 0) {
      id = list[list.length - 1].id + 1;
    } else {
      id = 1;
    }

    invoiceMessage.textContent = "Invoice Items";

    let obj = {
      id: id,
      name: event.target.name.value,
      price: event.target.price.value,
      quantity: event.target.quantity.value,
    };

    list.push(obj);
    console.log(list);
    totalInfo.classList.remove("hide");
    sortButtons.classList.remove("hide");
    table.classList.remove("hide");
    formArea.classList.remove("hide");

    //   const tr = document.querySelectorAll("tr");

    buildTable();
    buildMessage({
      message: "Item Added Sucessfully",
      className: "visual-success",
    });

    //reset form
    event.target.name.value = "";
    event.target.price.value = "";
    event.target.quantity.value = "";
  }
});

//Show Message
const buildMessage = ({ message, className = "visual-error" }) => {
  let p = document.createElement("p");
  let ptext = document.createTextNode(message);
  p.appendChild(ptext);

  let divcontrol = document.querySelector(".controls");
  // console.log(divcontrol);

  divcontrol.appendChild(p);
  p.className = className;

  setTimeout(() => {
    p.remove();
  }, 1000);
};

// show Edit Message
const buildEditMessage = ({ message, className = "visual-error" }) => {
  let messageDiv = document.querySelector("#edit-message");
  let ptext = document.createTextNode(message);
  messageDiv.appendChild(ptext);

  messageDiv.className = className;

  setTimeout(() => {
    // messageDiv.textContent = "";
    messageDiv.removeChild(ptext);
    messageDiv.className = "";
  }, 1000);
};

//edit a form
const editform = document.querySelector("#editForm");
editform.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.name.value === "") {
    buildEditMessage({ message: "Name Cannot be Empty" });
  } else if (
    isNaN(event.target.price.value) ||
    event.target.price.value === ""
  ) {
    buildEditMessage({ message: "Price must be number" });
  } else if (event.target.price.value <= 0) {
    buildEditMessage({ message: "Price must be greater than 0" });
  } else if (
    isNaN(event.target.quantity.value) ||
    event.target.quantity.value === ""
  ) {
    buildEditMessage({ message: "Quantity must be number" });
  } else if (event.target.quantity.value <= 0) {
    buildEditMessage({ message: "Qunatity must be greater than 0" });
  } else {
    buildEditMessage({
      message: "Item Edited Sucessfully",
      className: "visual-success",
    });
    setTimeout(() => {
      editItemFromForm(
        event.target.id.value,
        event.target.name.value,
        event.target.price.value,
        event.target.quantity.value
      );
    }, 500);
  }
});

//sort by Price
const sortPriceButton = document.querySelector("#sort-price");
sortPriceButton.addEventListener("click", () => {
  list.sort(compare_item);
  console.log(list);
  ascending = !ascending;
  buildTable();
});

//sort by quantity
const sortQuantityButton = document.querySelector("#sort-quantity");
sortQuantityButton.addEventListener("click", () => {
  list.sort(compare_item_quantity);
  console.log(list);
  ascending = !ascending;
  buildTable();
});

const compare_item = (a, b) => {
  // a should come before b in the sorted order
  if (parseFloat(a.price) < parseFloat(b.price)) {
    return ascending ? -1 : 1;
    // a should come after b in the sorted order
  } else if (parseFloat(a.price) > parseFloat(b.price)) {
    return ascending ? 1 : -1;
    // and and b are the same
  } else {
    return 0;
  }
};

const compare_item_quantity = (a, b) => {
  // a should come before b in the sorted order
  if (parseFloat(a.quantity) < parseFloat(b.quantity)) {
    return ascending ? -1 : 1;
    // a should come after b in the sorted order
  } else if (parseFloat(a.quantity) > parseFloat(b.quantity)) {
    return ascending ? 1 : -1;
    // and and b are the same
  } else {
    return 0;
  }
};

const editItemFromForm = (id, name, price, quantity) => {
  list[index].name = name;
  list[index].price = price;
  list[index].quantity = quantity;
  buildTable();
  toggleDialog();
};

//delete previous and build new table
const buildTable = () => {
  //remove previous data and add table headers
  document.querySelectorAll(".table-body ").forEach((all) => all.remove());
  if (list.length > 0) {
    list.forEach((l) => {
      // makeRow(l);
      table.innerHTML += `<div class="table-body row d-flex">
      <div class="col flex-1 text-right">${l.id}</div>
      <div class="col flex-3 text-center">${l.name}</div>
      <div class="col flex-1 text-center">${l.quantity}</div>
      <div class="col flex-1 text-center">${l.price}</div>
      <div class="col flex-2 text-center">${l.price * l.quantity}</div>
      <div class="col flex-3 text-center">
        <button onclick="editItem(${l.id})">Edit</button>
        <button class="delete" onclick="deleteItem(${l.id})">Delete</button>
      </div>
    </div>`;
    });

    calculateTotal();
  } else {
    table.classList.add("hide");
    invoiceMessage.textContent = "No Item added. Add it to see a list here";
    totalInfo.classList.add("hide");
    sortButtons.classList.add("hide");
    formArea.classList.add("hide");
  }
};
//delete previous and build new table
const buildHistoryCard = () => {
  //remove previous data and add table headers
  document.querySelectorAll(".history-list").forEach((all) => all.remove());
  let historyDetails = document.querySelector(".history-lists");

  console.log("Final", historyArray);

  if (historyArray.length > 0) {
    historyHeading.textContent = "Invoice History";
    historyArray.forEach((l) => {
      let tableOutput = "";
      l.items.forEach((item) => {
        tableOutput += `<div class="history-table-body row d-flex">
        <div class="col flex-1 text-right">${item.id}</div>
        <div class="col flex-3 text-center">${item.name}</div>
        <div class="col flex-1 text-center">${item.quantity}</div>
        <div class="col flex-1 text-center">${item.price}</div>
        <div class="col flex-2 text-center">${
          parseFloat(item.quantity) * parseFloat(item.price)
        }</div>
      </div>`;
      });
      let vat = (l.total * 0.13).toFixed(2);
      let gtotal = l.total + vat;
      // makeRow(l);
      historyDetails.innerHTML += `<div class="history-list">
      <div
        class="details-container d-flex flex-direction-row justify-space-between"
        onclick="expandCard(event)">
        <div class="details">
          <div class="name">Name: ${l.name}</div>
          <div class="name">Contact Info :${l.phone}</div>
          <div class="name">Total: Rs.${l.total}</div>
          <div class="name">Discount: Rs.(${l.discount})</div>
          <div class="name">VAT(13%): Rs.${vat}</div>
          <div class="name">Grand Total: Rs.${gtotal}</div>
          <div class="name">Date: ${l.date.toLocaleTimeString()} </div>
        </div>
        <div class="expand-container">
        </div>
      </div>
      <div class="expanded-details hide">
        <div class="table-area">
          <div class="table flex-1">
            <div class="table-headers row d-flex">
              <div class="col flex-1 text-right">Id</div>
              <div class="col flex-3 text-center">Name</div>
              <div class="col flex-1 text-center">Quantity</div>
              <div class="col flex-1 text-center">Price</div>
              <div class="col flex-2 text-center">Total</div>
            </div>
           ${tableOutput}
         </div>
        </div>
      </div>
    </div>`;
    });

    calculateTotal();
  } else {
    historyHeading.textContent = "No Item added in history";
  }
};

const expandCard = (event) => {
  event.stopPropagation();
  const plus = document.querySelector(".expand-container");
  const detailsContainer = document.querySelector(".details-container");
  if (event.target == plus) {
    console.log();
    event.target.parentElement.nextElementSibling.classList.toggle("hide");
    event.target.classList.toggle("active");

    // event.target.nextElementSibling.classList.toggle("hide");
  } else if (event.target == detailsContainer) {
    event.target.children[1].classList.toggle("active");

    event.target.nextElementSibling.classList.toggle("hide");
  } else {
    event.target.parentElement.nextElementSibling.classList.toggle("active");
    event.target.parentElement.parentElement.nextElementSibling.classList.toggle(
      "hide"
    );
  }
};

let total = 0;
//calculate total and vat
const calculateTotal = () => {
  let totalWithoutVat = document.querySelector(".showTotal");
  let discountDiv = document.querySelector(".showDiscount");
  let vatDiv = document.querySelector(".showVat");
  let totalWithVat = document.querySelector(".showTotalWithVat");
  total = 0;
  list.forEach((l) => {
    total = total + l.price * l.quantity;
  });
  console.log(total);
  console.log(totalWithoutVat);
  let vat = (total * 0.13).toFixed(2);

  totalWithoutVat.textContent = `Total Without VAT: Rs.${total}`;
  vatDiv.textContent = `Total VAT: Rs.${vat}`;
  discountDiv.textContent = `Discount: Rs.0`;
  let totalAmtWithVat = (parseFloat(total) + parseFloat(vat)).toFixed(2);
  totalWithVat.textContent = `Total with VAT: Rs.${totalAmtWithVat}`;
};

const deleteItem = (id) => {
  console.log(id);
  deleteId = id;
  toggleDeleteDialog();
};

const editItem = (id) => {
  toggleDialog();
  let editname = document.querySelector("#editname");
  let editprice = document.querySelector("#editprice");
  let editquantity = document.querySelector("#editquantity");
  let hiddenId = document.querySelector("#editid");
  index = list.findIndex((l) => l.id == id);
  editname.value = list[index].name;
  editprice.value = list[index].price;
  editquantity.value = list[index].quantity;
  hiddenId.value = id;
};

const toggleDialog = () => {
  document.querySelector(".dialog").classList.toggle("open");
  document.querySelector(".dialog").classList.toggle("close");
};
const toggleDeleteDialog = () => {
  document.querySelector(".delete-dialog").classList.toggle("open");
  document.querySelector(".delete-dialog").classList.toggle("close");
};

let deleteButton = document.querySelector("#delete");
deleteButton.addEventListener("click", (event) => {
  list = list.filter((l) => l.id != deleteId);
  console.log(list);
  toggleDeleteDialog();
  buildTable();
});

const clearAll = () => {
  list = [];
  buildTable();
};

const inputHandler = (e) => {
  e.target.classList.remove("error");
  e.target.nextElementSibling.classList.remove("showerror");
  e.target.nextElementSibling.classList.add("hideerror");
  // historyObj[e.target.name] = e.target.value;
  // console.log(historyObj);
};

const saveToHistory = () => {
  const nameInput = document.querySelector("#personName");
  const phoneInput = document.querySelector("#personContact");
  if (nameInput.value == "") {
    nameInput.classList.add("error");
    nameInput.nextElementSibling.classList.remove("hideerror");
    nameInput.nextElementSibling.classList.add("showerror");
    nameInput.nextElementSibling.textContent = "Name cannot be empty";
    nameInput.focus();
    console.log("name");
  } else if (
    phoneInput.value == "" ||
    isNaN(phoneInput.value) ||
    phoneInput.value.length !== 10
  ) {
    console.log(phoneInput.value.length);
    
    phoneInput.classList.add("error");
    phoneInput.nextElementSibling.classList.remove("hideerror");
    phoneInput.nextElementSibling.classList.add("showerror");
    phoneInput.nextElementSibling.textContent = "Enter valid phone Number";
    phoneInput.focus();
    console.log("phone");
  } else {
    console.log("history");

    let id;
    if (historyArray.length > 0) {
      id = historyArray[historyArray.length - 1].id + 1;
    } else {
      id = 1;
    }

    const obj = {
      id: id,
      items: list,
      name: nameInput.value,
      phone: phoneInput.value,
      discount: 0,
      total: total,
      date: new Date(),
    };

    historyArray.push(obj);
    console.log(historyArray);

    nameInput.value = "";
    phoneInput.value = "";

    //clear list
    list = [];

    buildTable();

    buildHistoryCard();

    //showhistory
    showHistory();
  }
};

const showHistory = () => {
  const historyTab = document.querySelector(".history");
  historyTab.classList.remove("hide");
  document.querySelector(".home").classList.add("hide");

  const navItems = document.querySelectorAll(".nav-item");
  navItems[0].classList.remove("active");
  navItems[1].classList.add("active");
};

const showHome = () => {
  const historyTab = document.querySelector(".home");
  historyTab.classList.remove("hide");
  document.querySelector(".history").classList.add("hide");

  const navItems = document.querySelectorAll(".nav-item");
  navItems[1].classList.remove("active");
  navItems[0].classList.add("active");
};

buildTable();

buildHistoryCard();
