const ERROR_DOCS_URL = "https://octanejs.dev/errors/";
const UNPAIRED_SURROGATE = /[\uD800-\uDFFF]/gu;
function encodeErrorArgument(value) {
  return encodeURIComponent(String(value).replace(UNPAIRED_SURROGATE, "\uFFFD"));
}
function formatProdErrorMessage(code, args) {
  let url = ERROR_DOCS_URL + code;
  for (let i = 0; i < args.length; i++) {
    url += `${i === 0 ? "?" : "&"}args[]=${encodeErrorArgument(args[i])}`;
  }
  return `Minified Octane error #${code}; visit ${url} for the full message or use a development build for full errors and additional helpful warnings.`;
}
function formatDevErrorMessage(template, args) {
  let index = 0;
  return template.replace(
    /%s/g,
    () => index < args.length ? String(args[index++]) : "[missing argument]"
  );
}
function formatUnknownDevErrorMessage(code) {
  return `Unknown Octane error code ${code}. The generated error catalog is stale.`;
}
export {
  formatDevErrorMessage,
  formatProdErrorMessage,
  formatUnknownDevErrorMessage
};
