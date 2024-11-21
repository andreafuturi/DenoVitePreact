function counterOnLoad() {
  console.log("Counter.js loaded");
}
//this script is exectued every time the counter component is loaded from browser because it's imported with the Import tag using inline script
//eg. <Import src={counterOnLoad} selfExecute={true} />
//This script won't be minified in production for now

export default counterOnLoad;
