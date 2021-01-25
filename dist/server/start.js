const ApiDoc = require('./index');

const app = new ApiDoc();
app.config({
  scopePath: 'abc',
});
app.start();