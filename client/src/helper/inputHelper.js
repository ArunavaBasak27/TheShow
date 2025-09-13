const inputHelper = (e, data) => {
  const tempData = { ...data };
  const { name, type, value, checked } = e.target;

  tempData[name] = type === "checkbox" ? checked : value;
  return tempData;
};

export default inputHelper;
