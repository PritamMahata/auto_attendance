var firebaseConfig = {
  apiKey: "AIzaSyAuLNBOmrQW0cwD7s_8Mhim-UdGplZpr-8",
  authDomain: "esp32-73a15.firebaseapp.com",
  databaseURL: "https://esp32-73a15-default-rtdb.firebaseio.com",
  projectId: "esp32-73a15",
  storageBucket: "esp32-73a15.appspot.com",
  messagingSenderId: "131043075668",
  appId: "1:131043075668:web:133ccec05efb2253c7afc1",
  measurementId: "G-R9W9H17GN4",
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

const dataList = document.getElementById("data-list");

function displayData(data) {
  dataList.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Join Time</th>
            <th>Serial No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(data)
            .map((key) => {
              const item = data[key];
              return `
              <tr>
                <td>${item.Name}</td>
                <td>${item.Join_Time}</td>
                <td>${item.sl_no}</td>
                <td>
                  <button onclick="editData('${key}', '${item.Name}', '${item.Join_Time}', '${item.sl_no}')">Edit</button>
                  <button onclick="deleteData('${key}')">Delete</button>
                </td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    `;
}

function fetchData() {
  database.ref("station").once("value", (snapshot) => {
    const data = snapshot.val();
    displayData(data);
  });
}

function editData(key, name, joinTime, slNo) {
  // Check if edit form already exists, if not, create it
  let editForm = document.getElementById(`edit-form-${key}`);
  if (!editForm) {
    editForm = document.createElement("form");
    editForm.id = `edit-form-${key}`;
    editForm.innerHTML = `
        <input type="text" id="edit-name-${key}" placeholder="Name">
        <input type="text" id="edit-join-time-${key}" placeholder="Join Time">
        <input type="number" id="edit-sl-no-${key}" placeholder="Serial No">
        <button onclick="updateData('${key}')">Save</button>
        <button type="button" onclick="cancelEdit('${key}')">Cancel</button>
      `;
    dataList.appendChild(editForm);
  }

  // Populate edit form with existing values
  document.getElementById(`edit-name-${key}`).value = name;
  document.getElementById(`edit-join-time-${key}`).value = joinTime;
  document.getElementById(`edit-sl-no-${key}`).value = slNo;
}

function updateData(key) {
  const newName = document.getElementById(`edit-name-${key}`).value;
  const newJoinTime = document.getElementById(`edit-join-time-${key}`).value;
  const newSlNo = document.getElementById(`edit-sl-no-${key}`).value;

  database
    .ref(`station/${key}`)
    .update({
      Name: newName,
      Join_Time: newJoinTime,
      sl_no: parseInt(newSlNo),
    })
    .then(() => {
      console.log("Data updated successfully");
      fetchData();
    })
    .catch((error) => console.error("Error updating data:", error));
}

function cancelEdit(key) {
  document.getElementById(`edit-form-${key}`).style.display = "none";
}

function deleteData(key) {
  database
    .ref(`station/${key}`)
    .remove()
    .then(() => {
      console.log("Data deleted successfully");
      fetchData();
    })
    .catch((error) => console.error("Error deleting data:", error));
}

function addUser() {
  const name = document.getElementById("name").value;
  const joinTime = document.getElementById("join-time").value;
  const slNo = document.getElementById("sl-no").value;

  database
    .ref("station")
    .push({
      Name: name,
      Join_Time: joinTime,
      sl_no: parseInt(slNo),
    })
    .then(() => {
      console.log("User added successfully");
      document.getElementById("name").value = "";
      document.getElementById("join-time").value = "";
      document.getElementById("sl-no").value = "";
      fetchData();
    })
    .catch((error) => console.error("Error adding user:", error));
}



fetchData();
