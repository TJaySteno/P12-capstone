module.exports = [
  {
    id: 1,
    title: 'Random Quote Generator',
    description: 'For my first Tech Degree project, I have created a simple quote generation app. It selects one out of a number of famous quotes and displays it to the page. Quotes can be cycled manually by clicking a button, otherwise they will cycle through on a timer. Finally, the background color for the page will update based on the subject matter: red for love, brown for history, green for money, etc.',
    skills: ['vanilla JavaScript', 'basics', 'loops', 'arrays', 'objects'],
    url: 'https://tjaysteno.github.io/P01-quote-generator/'
  },
  {
    id: 2,
    title: 'Pagination & Content Filter',
    description: 'In this second project, I created a program that accepts a list of students of any length. It divides that list into pages of 10 students each, creates pagination links, and updates the HTML dynamically as the user navigates through those pages. Additionally, I have added a search feature that allows a user to search for students by name or email.',
    skills: ['jQuery', 'DOM traversal & manipulation', 'unobtrusive JavaScript'],
    url: 'https://tjaysteno.github.io/P02-pagination/'
  },
  {
    id: 3,
    title: 'Build an Interactive Form',
    description: "In my third Tech Degree project, I have created the validation logic for an interactive form. This form dynamically responds to a user's actions in a number of ways; as an example, it hides or displays fields like \"Other Job Title\" and the credit card payment section until needed. During workshop registration, my code notifies users when their class runs concurrently to another and won't allow a user to select two concurrent classes. Finally, the form validates in real time as a user makes their way through the form, in some cases even as the user is typing. I have used jQuery in this project once again, just to reinforce what I learned on the last project.",
    skills: ['HTML forms', 'CSS', 'DOM Scripting', 'form validation', 'jQuery'],
    url: 'https://tjaysteno.github.io/P03-interactive-form/'
  },
  {
    id: 4,
    title: 'Tic-Tac-Toe',
    description: "My job for this project was to write the code to create a game of Tic-Tac-Toe. I was provided with the HTML and CSS for three screens: one for name input, one for the game, and one victory screen. With those, I wrote code to allow a user to play the game vs a friend or my AI. I take name(s) for 1 or 2 users, display those during the game, and on the victory screen to congratulate the winner by name. While it wasn't needed to pass, I was able to create an unbeatable AI; something I had been wanting to do for a while.",
    skills: ['Object Oriented JS', "'this'", 'array iteration', 'callback functions'],
    url: 'https://tjaysteno.github.io/P04-tac-tac-toe/'
  },
  {
    id: 5,
    title: 'Use a Public API to Create an Employee Directory',
    description: "My task for this project was to create a page that loads \"employee records\" from a public API. While past projects had provided me with HTML and CSS, this one simply provided me with 2 pictures of mockups that I was to emulate. Therefore, this was my first Tech Degree project where I built all my own HTML and CSS from scratch (though I had done it on my own projects before this). To complete this project, I made and styled a single employee div that I populate with results from the API and duplicate. These have been styled into a grid. Finally, a user can click on an employee div to view their modal window with more info on that person.",
    skills: ['HTML & CSS from scratch', 'HTTP', 'AJAX', 'Git'],
    url: 'https://tjaysteno.github.io/P05-employee-directory/'
  },
  {
    id: 6,
    title: 'Build a Content Scraper',
    description: "This sixth project was my first Node.js project for my Tech Degree. Using Node.js and different packages found through npm, this app will scrape information off of a mock website built for this course (http://shirts4mike.com/shirts.php). Using an npm content scraper (Cheerio), I will grab and sort the vital information. This will then be stored in a CSV file using another npm package (papaparse). I've chosen these two packages due to their widespread use and the recency of their last updates.",
    skills: ['Node.js', 'npm']
  },
  {
    id: 7,
    title: 'Build a Twitter Interface',
    description: "In this project, I have used Express alongside Pug to request and display information from Twitter. This information includes my own info, my 5 most recent tweets, 5 of my followers, and 5 direct messages from my most recent conversation. Of course, supplemental information on Tweets and DMs (likes, retweets, time posted, etc.) will be displayed as well. For this project, I was given HTML and CSS that I reformatted to be used with Express and Pug.",
    skills: ['Node.js', 'Express', 'Pug/Jade', 'Twitter API']
  },
  {
    id: 8,
    title: 'Using Gulp to Build a Front End Website',
    description: "This project uses Gulp to streamline development of a website. It first takes Sass files and converts them to CSS. It then concatenates all CSS files into a single file, minimizes it, and creates a map to the source files. This process is repeated for the JavaScript as well. Finally, it places all the converted source files into a separate 'dist' folder and watches for changes to the source Sass files, ready to restart the server with the new styles.",
    skills: ['Gulp', 'Node.js', 'npm', 'build tools']
  },
  {
    id: 9,
    title: 'Create a Gallery App with React',
    description: "In this project, I have created a single page app that uses React, React Router DOM, and the Flickr API to dynamically load pictures into a gallery. There are be some preset options in the nav bar (Beach, Forest, Lake, etc), but users will also have the option use the search bar to find their own queries. For this project, I was provided with an HTML file which I have broken down into React components. From there, my router uses the URL to know which components to display and when to request photos from Flickr.",
    skills: ['React', 'React Router', 'Flickr API']
  },
  {
    id: 10,
    title: 'Build a Library Manager',
    description: "In this project I have been tasked with creating the database manager for a local library. This will track library patrons, books, and any current or past book loans. Using Express alongside Pug, a librarian for my fictitious library can add a new book, show all books, or display books that are either checked out or overdue. They can also display all patrons or create a new one. Finally, they can create a new loan, display every loan past and present, or show all current or overdue loans. For this project I was provided with template HTML and CSS files which I converted into Pug for use with Express.",
    skills: ['SQL', 'SQLite', 'Sequelize', 'Express', 'Pug/Jade']
  },
  {
    id: 11,
    title: 'Build a Course Rating API With Express',
    description: "In this project, I have built a REST API to handle requests for a course rating website. Users can create profiles, look up courses or create a new one, look up reviews and even submit their own. When looking up a specific course (the most complex route), you will get all information on the course itself as well as the information on the teacher ('user' subdocument) and the reviews ('review' subdocuments). Additionally, reviews go one level deeper to get info on the user that submitted them. Inception.",
    skills: ['MongoDB', 'Mongoose', 'REST API', 'Express']
  },
  {
    id: 12,
    title: 'Capstone Project: Build Your Own Web Application',
    description: "In this final project I will be pulling together many of the things I've learned over the course of this Tech Degree. My task is to access 3 or more APIs and present the data for the end-user. My plan as of this moment is to access the API at NASA to find the coordinates for the International Space Station, then use Google Maps to show the area directly below it as though the astronauts are looking down. Third, and most importantly, I think everyone knows that what the astronauts really want is some Chipotle, so I will find the distance to the nearest one then use Yelp to pull up reviews and ratings for that store.",
    skills: ['JavaScript', 'Bootstrap', 'CSS', 'Node.js', 'Express', 'React', 'SQL', 'APIs']
  }
];
