const express = require("express");
const hbs = require("hbs"); //'hbs' is an Express.js View engine for handlebars.js
const fs = require("fs");

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + "/views/partials");
// This will tell Express WHAT 'View Engine' we'd like to USE, in our case we want to use the 'hbs' PACKAGE
app.set("view engine", "hbs");

/* 'app.use' is how we REGISTER a 'Middleware', it takes a just ONE Function where we pass 'req' 'res' and 'next'.
With the 'next' last argument REFERS to the the NEXT Middleware Function, a Middleware Function is a function that
have ACCESS to the 'request' and 'response' Objects, Middleware Functions can perform task like 'executing any code'
or 'make changes to the request and the response objects' or 'CALL the NEXT Middleware function in the STACK'. 
IF the CURRENT Middleware function doesn't END the request-response CYCLE, it MUST call 'next()' to pass control
to the NEXT Middleware, otherwise the request will be left HANGING. In our example we have a Middleware function
with NO PATH, so the Middleware is executed EVERY TIME the app receives a request. */
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile("server.log", log + "\n", err => {
    if (err) {
      console.log("Unable to append to server.log");
    }
  });
  next();
});

/* This Middleware will STOP everything AFTER it from executing, we DON'T call 'next()' so the actual handler(so 
the 'app.get('/',...)' and 'app.get('/about',...)') will NEVER be executed */
// app.use((req, res, next) => {
//   res.render("maintenance.hbs");
// });

/* This 'static' method below is a BUILT-IN Middleware function in Express that let us serve STATIC files such as
images, CSS files and JavaScript files. It takes as FIRST argument the 'root' directory from which to SERVE our
static assets. NOW, the PATH that we provide inside the 'express.static' function is RELATIVE to the directory 
from where we LAUNCH our node process SO if for example we run this express app from ANOTHER directory we would 
get an error, SO it’s SAFER to use the absolute path(so the '__dirname' that STORES the path to our project 
directory, in our case it's 'node-web-server', so the name of the Project folder) and CONCATENATE(the '+' symbol) 
it with the '/public' folder to tell it to use THIS directory for our server. So NOW if we restart this server.js
file(so our SERVER pretty much) with NODEMON and from the browser we go on the page 'localhost:3000/help.html' we
would see our page(so our 'help.html' file pretty much), in THIS way we have set up a STATIC directory pretty 
easily */
app.use(express.static(__dirname + "/public"));

/* This 'registerHelper' function takes TWO arguments, the FIRST argument is the NAME of the HELPER and the SECOND
argument is the FUNCTION we want to RUN */
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

/* So by using the 'registerHelper' HANDLEBAR method we can both CREATE Functions that DON'T take argument(like 
for the helper here above) and Functions that DO take arguments like in this example below */
hbs.registerHelper("screamIt", text => {
  return text.toUpperCase();
});

/* There are TWO arguments we have to pass INSIDE this 'get' function, the FIRST argument is the URL(in our case 
will be the ROOT of our app so we just use '/') and the SECOND argument will be the Function that tells Express
WHAT to send back to the person who made the request. NOW this Function is going to get called with TWO arguments,
that are REALLY important on HOW Express works, the FIRST one is 'req'(request) and the SECOND is 'res'(response). 
The 'req'(request) STORES a ton of information about the request coming IN, things like the HEADERS that were used
or any BODY information, the METHOD that was made with the request or the PATH, they ALL get stored in the 'req'.
In the second argument 'res'(response) instead has a TONS of METHODS available for us to use so that we can respond
to the HTTP Request in ANY way we like, we can CUSTOMIZE any data we send back, we can set our HTTP status code, so
we can do ALL sorts of things. For NOW we're just going to use the 'send' method that will let use RESPOND to the
request by sending some data BACK, so the string 'Hello Express!' is going to be the RESPONSE for the HTTP request,
so when someone views the Website they're going to see THIS string OR if they made a request from an application
they're going to get THIS(the 'Hello Express!' string) back as the BODY data */
app.get("/", (req, res) => {
  //res.send('<h1>Hello Express!</h1>');
  /* When we call 'res.send' PASSING IN an Object, Express NOTICES that, it takes the Object and CONVERTS it 
    into JSON and sends it BACK to the Browser. */
  //   res.send({
  //     name: "R4z1ell",
  //     likes: ["Videogames", "Food"]
  //   });
  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome to my website"
  });
});

app.get("/about", (req, res) => {
  /* This 'render' method will let us render ANY of the Templates we have set up with our CURRENT 'View Engine'.
  Then passing data is really simple, ALL we have to do is passing an OBJECT as second argument to this 'render'
  function and inside this Object we can specify whatever property we want */
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Unable to fulfill this request"
  });
});

/* This 'app.listen' below is going to BIND our application to a PORT on our machine(our Computer), in our case(so
for our LOCAL host) we're going to use the PORT 3000 that is a really common port for developing LOCALLY. So NOW 
with all of this in place we're DONE, we have our very first 'Express Server' and we can actually run things from
the TERMINAL and view it in the BROWSER. So now we FIRST start our server with NODEMON, so we write inside the
terminal 'nodemon server.js'(without quotes of course) and THEN inside the browser we go on the 'localhost:3000' 
page where we will see our 'Hello Express!' message. So for now we're doing nothing too fancy, we're just sending
this 'Hello Express!' string BACK to the CLIENT that MADE the request. This 'listen' method take ALSO an OPTIONAL
second argument that is a FUNCTION that let us do something ONCE the server is UP because it can take a little
bit of time to get started, in our case inside the function we just print a simple message that will show up in the
terminal */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
