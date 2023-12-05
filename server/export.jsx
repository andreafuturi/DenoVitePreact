const upload = ({ id }) => {
  return { key: "My secret key is: rom4om4" + id };
};
const ServerOnlyComponent = () => {
  console.log("Secret Key");
  return <h1>Special Admin Route with Secret: i4jr8i4jr94</h1>;
};

export { upload, ServerOnlyComponent };
