let usersData = {};

function fetchData() {
  database.ref("station").once("value", (snapshot) => {
    usersData = snapshot.val();
    displayData(usersData);
  });
}

function sortData() {
  const sortBy = document.getElementById("sort-by").value;
  const sortedData = Object.keys(usersData).sort((a, b) => {
    if (sortBy === "name") {
      return usersData[a].Name.localeCompare(usersData[b].Name);
    } else if (sortBy === "joinTime") {
      return usersData[a].Join_Time.localeCompare(usersData[b].Join_Time);
    } else if (sortBy === "slNo") {
      return usersData[a].sl_no - usersData[b].sl_no;
    }
  });
  displayData(
    sortedData.reduce((acc, key) => {
      acc[key] = usersData[key];
      return acc;
    }, {})
  );
}

function filterData() {
  const filterValue = document.getElementById("filter-by").value.toLowerCase();
  const filteredData = Object.keys(usersData).filter((key) => {
    return usersData[key].Name.toLowerCase().includes(filterValue);
  });
  displayData(
    filteredData.reduce((acc, key) => {
      acc[key] = usersData[key];
      return acc;
    }, {})
  );
}

function displayData(data) {
  const dataList = document.getElementById("data-list");
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

fetchData();