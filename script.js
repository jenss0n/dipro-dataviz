fetch("compiled_data.json")
  .then((response) => response.json())
  .then((data) => {
    const policyContainer = document.getElementById("policy-container");
    data[0].dimensions.forEach((dimension, index) => {
      const policyItem = document.createElement("div");
      policyItem.classList.add("policy-item");

      const policyHeader = document.createElement("div");
      policyHeader.classList.add("policy-header");

      const policyNumber = document.createElement("p");
      policyNumber.classList.add("policy-number");
      policyNumber.innerText = index + 1;

      const policyName = document.createElement("p");
      policyName.classList.add("policy-name");
      policyName.innerText = dimension.label;

      policyHeader.appendChild(policyNumber);
      policyHeader.appendChild(policyName);

      policyItem.appendChild(policyHeader);

      Object.keys(dimension.scores).forEach((year) => {
        const yearDiv = document.createElement("div");
        yearDiv.classList.add("years");
        yearDiv.innerText = year;
        policyItem.appendChild(yearDiv);
      });

      policyContainer.appendChild(policyItem);
    });
  })
  .catch((error) => console.error("Error loading the JSON data:", error));
