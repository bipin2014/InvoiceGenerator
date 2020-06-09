const table = document.querySelector("#invoices");

// var list = [{ id: 1, name: "test", price: 10, quantity: 10 }];
var list = [];
let ascending = true;
var invoiceMessage = document.querySelector("#invoiceMessage");

invoiceMessage.textContent =
  "No Item added Yet. Add it to see a list of item here";

var totalInfo = document.querySelector("#total-info");
var sortButtons = document.querySelector(".sort-buttons");
let index;
let deleteId;

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

    var obj = {
      id: id,
      name: event.target.name.value,
      price: event.target.price.value,
      quantity: event.target.quantity.value,
    };

    list.push(obj);
    console.log(list);
    totalInfo.classList.remove("hide");
    sortButtons.classList.remove("hide");

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
  var p = document.createElement("p");
  var ptext = document.createTextNode(message);
  p.appendChild(ptext);

  var divcontrol = document.querySelector(".controls");
  // console.log(divcontrol);

  divcontrol.appendChild(p);
  p.className = className;

  setTimeout(() => {
    p.remove();
  }, 1000);
};

// show Edit Message
const buildEditMessage = ({ message, className = "visual-error" }) => {
  var messageDiv = document.querySelector("#edit-message");
  var ptext = document.createTextNode(message);
  messageDiv.appendChild(ptext);

  messageDiv.className = className;

  setTimeout(() => {
    messageDiv.textContent = "";
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
  table.innerHTML = "";
  if (list.length > 0) {
    table.innerHTML =
      "<thead><th>Id</th><th>Name</th><th>Price</th><th>Quantity</th><th>Total</th><th>Actions</th></thead>";

    list.forEach((l) => {
      makeRow(l);
    });

    calculateTotal();
  } else {
    invoiceMessage.textContent = "No Item added. Add it to see a list here";
    totalInfo.classList.add("hide");
    sortButtons.classList.add("hide");
  }
};

const makeRow = (l) => {
  var tablerow = document.createElement("tr");

  var rowId = document.createElement("td");
  rowId.textContent = l.id;
  var nameData = document.createElement("td");
  nameData.textContent = l.name;
  var priceData = document.createElement("td");
  priceData.textContent = l.price;
  var quantityData = document.createElement("td");
  quantityData.textContent = l.quantity;
  var totalAmt = document.createElement("td");
  totalAmt.textContent = l.price * l.quantity;

  var actions = document.createElement("td");

  //buttons
  var editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", (event) => {
    editItem(l.id);
  });
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.id = "remove";
  deleteButton.addEventListener("click", (event) => {
    deleteItem(l.id);
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  tablerow.appendChild(rowId);
  tablerow.appendChild(nameData);
  tablerow.appendChild(priceData);
  tablerow.appendChild(quantityData);
  tablerow.appendChild(totalAmt);
  tablerow.appendChild(actions);
  table.appendChild(tablerow);
};

//calculate total and vat
const calculateTotal = () => {
  var totalWithoutVat = document.querySelector(".showTotal");
  var vatDiv = document.querySelector(".showVat");
  var totalWithVat = document.querySelector(".showTotalWithVat");
  var total = 0;
  list.forEach((l) => {
    total = total + l.price * l.quantity;
  });
  console.log(total);
  console.log(totalWithoutVat);
  var vat = (total * 0.13).toFixed(2);

  totalWithoutVat.textContent = `Total Without VAT: Rs.${total}`;
  vatDiv.textContent = `Total VAT: Rs.${vat}`;
  var totalAmtWithVat = (parseFloat(total) + parseFloat(vat)).toFixed(2);
  totalWithVat.textContent = `Total with VAT: Rs.${totalAmtWithVat}`;
};

const deleteItem = (id) => {
  console.log(id);
  deleteId = id;
  toggleDeleteDialog();
};

const editItem = (id) => {
  toggleDialog();
  var editname = document.querySelector("#editname");
  var editprice = document.querySelector("#editprice");
  var editquantity = document.querySelector("#editquantity");
  var hiddenId = document.querySelector("#editid");
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

var deleteButton = document.querySelector("#delete");
deleteButton.addEventListener("click", (event) => {
  list = list.filter((l) => l.id != deleteId);
  console.log(list);
  toggleDeleteDialog();
  buildTable();
});

buildTable();
