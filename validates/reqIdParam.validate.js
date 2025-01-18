const isValidId = (id) => {
  // Check if ID is a non-empty string that starts with letters followed by numbers
  return typeof id === "string" && /^[A-Za-z]+\d+$/.test(id.trim());
};

module.exports = isValidId;
