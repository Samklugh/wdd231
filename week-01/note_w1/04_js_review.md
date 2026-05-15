W01 Learning Activity: JavaScript Review
Overview
This activity is a review of some basic JavaScript concepts, application, and DOM (Document Object Model) manipulation. JavaScript is a core web technology in web frontend design and development along with HTML and CSS. This course will require the application of JavaScript to meet functional and developmental outcomes.

Activity Instructions
As you work through this JavaScript Learning Activity assignment, you will be asked to make a copy (called a fork) of a partially completed CodePen. The JS tab of this CodePen has a series of comments starting around line 22 where you will add or alter JavaScript to finish steps 4 through 10 of this assignment.

What is the correct HTML markup to reference an external JavaScript file named app.js located in the scripts folder?
Check Your Understanding
<script src="scripts/app.js"></script>
<script src="scripts/app.js" defer></script>
Where should this script reference be located in the HTML document?

If you reference this script in the head of the document, you should use the defer attribute given that the script may contain references to the document object that need to be rendered first. The first example given here is a reference that is used at the end of the document, right before the closing </body> tag.

Screenshot of Fork button in CodePen
Fork button in CodePen
If you haven't already, establish your own CodePen account at no cost. This will enable you to fork content and construct your own pens (code snippets) for personal reference.
Fork (copy) this CodePen JavaScript Review Exercise and complete the following:
Change the given date output to this format: mon dd, year (for example, "Apr 04, 2024")
Check Your Understanding
Modify the given variable options object settings.
Change the locale parameter from "en-UK" to "en-US" in the toLocaleDateString method.
Replace this concatenated string using a template literal.
"<strong>Volume</strong>: " + volume + " liters"
Check Your Understanding
`<strong>Volume</strong>: ${volume} liters`
Declare a variable named quantity and assign it the value of the HTML input element with an id of q using the querySelector method.
Check Your Understanding
let quantity = document.querySelector('#q').value;
Output this string, "Welcome to <em>our</em> neighborhood!", to the first <aside> in the document.
Check Your Understanding
document.querySelector('aside').innerHTML = 'Welcome to <em>our</em> neighborhood!';
Why use innerHTML versus textContent in this specific case? Try It.
Is is OK to use double quotes to contain the output string?
Is it OK to use backticks (`) to contain the output string?
Output the returned value of a function named getCelsius to an HTML input element with an id of temp. Feed the getCelsius literal value of 33 (which represents 33°F). The getCelsius function is already included in the provided CodePen code.
Check Your Understanding
document.querySelector('#temp').value = getCelsius(33);
An HTML <input>< elem>ent does not have an innerHTML nor textContent property. Instead you can change the value property which is displayed in the input element.

Select all the div elements in a document and assign the result to a const variable named divs using querySelectorAll. Output to the provided div element with an id of divs in the CodePen.
Check Your Understanding
const divs = document.querySelectorAll('div');
The resulting NodeList is a collection of nodes from the document driven by querySelectorAll. It has a length and is zero-based indexed.
Filter an array named citynames to return only city names in the array that start with the letter "C" and store the resulting array into a variable named filterC. Output to the provided div element with in the CodePen.
Check Your Understanding
let filterC = citynames.filter(city => city.charAt(0) === 'C');
Example Solution
Example Solutions CodePen: JavaScript Review Exercise Solutions