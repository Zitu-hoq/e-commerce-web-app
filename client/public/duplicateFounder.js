function findDuplicateNames(jsonData) {
  if (!Array.isArray(jsonData)) {
    console.error("Input should be an array of objects");
    return [];
  }

  const nameCount = {};
  const duplicates = [];

  jsonData.forEach((obj) => {
    if (obj && obj.name) {
      const name = obj.name;
      nameCount[name] = (nameCount[name] || 0) + 1;

      if (nameCount[name] === 2) {
        duplicates.push(name);
      }
    }
  });

  return duplicates;
}

// Load the JSON file from the same directory
const data = require("./bd-upazilas.json");

// Find duplicates
const duplicates = findDuplicateNames(data.upazilas);
console.log("Duplicate names:", duplicates);
