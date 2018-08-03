module.exports = [
  {
    id: 1,
    title: 'Random Quote Generator',
    description: 'For my first Tech Degree project, I created a simple quote generation app. It randomly selects one of a number of famous quotes and displays it. Quotes can be cycled manually by clicking a button, otherwise they will cycle through on a timer. Finally, the background color for the page will update based on the subject matter: red for love, brown for history, green for money, etc.',
    skills: ['vanilla JavaScript', 'basics', 'loops', 'arrays', 'objects'],
    url: 'https://tjaysteno.github.io/P01-quote-generator/'
  },
  {
    id: 2,
    title: 'Pagination & Content Filter',
    description: 'In my second project, I created a program that accepts a list of students of any length. It divides that list into pages of 10 students each, creates pagination links, and updates the HTML dynamically as the user navigates through the pages. Additionally, I have added a search feature that allows a user to search for students by name or email.',
    skills: ['jQuery', 'DOM traversal & manipulation', 'unobtrusive JavaScript'],
    url: 'https://tjaysteno.github.io/P02-pagination/'
  },
  {
    id: 3,
    title: 'Build an Interactive Form',
    description: "In my third Tech Degree project, I created the validation logic for an interactive form. This form dynamically responds to a user's actions in a number of ways; as an example, it hides or displays fields like \"Other Job Title\" and the credit card payment section until needed. During workshop registration, my code notifies users when their class runs concurrently to another and won't allow a user to select two concurrent classes. Finally, the form validates in real time as a user makes their way through the form.",
    skills: ['HTML forms', 'CSS', 'DOM Scripting', 'form validation', 'jQuery'],
    url: 'https://tjaysteno.github.io/P03-interactive-form/'
  },
  {
    id: 4,
    title: 'Tic-Tac-Toe',
    description: "My job for this project was to write the code to create a game of Tic-Tac-Toe. I was provided with the HTML and CSS for three screens: one for name input, one for the game, and one victory screen. With those, I wrote code to allow a user to play the game vs a friend or my AI. While it wasn't needed to pass, I was able to create an unbeatable AI; something I had been wanting to do for a while.",
    skills: ['Object Oriented JS', "'this'", 'array iteration', 'callback functions'],
    url: 'https://tjaysteno.github.io/P04-tac-tac-toe/'
  },
  {
    id: 5,
    title: 'Use a Public API to Create an Employee Directory',
    description: "My task for this project was to create a page that loads \"employee records\" from a public API. While past projects had provided me with HTML and CSS, this one simply provided me with 2 images of mockups that I was to emulate. Therefore, this was my first Tech Degree project where I built all my own HTML and CSS from scratch (though I had previously done it on my own projects). To complete this project, I made and styled an employee div template that I populate with results from the API and duplicate. These have been styled into a grid. Finally, a user can click on an employee to expand a modal window which provides more information on that employee.",
    skills: ['HTML & CSS from scratch', 'HTTP', 'AJAX', 'Git'],
    url: 'https://tjaysteno.github.io/P05-employee-directory/'
  },
  {
    id: 6,
    title: 'Build a Content Scraper',
    description: "The sixth project was my first Node.js project for my Tech Degree. Using Node.js and different packages found through npm, this app will scrape information off of a mock website built for this course. Using an npm content scraper, I will grab and sort the vital information. This will then be stored in a CSV file using another npm package. I chose these two packages due to their widespread use and the recency of their latest updates.",
    skills: ['Node.js', 'npm']
  },
  {
    id: 7,
    title: 'Build a Twitter Interface',
    description: "In this project, I used Express alongside Pug to request and display information from Twitter. This information includes my own profile information, my five most recent tweets, five of my followers, and my five most recent direct messages (DMs). Of course, supplemental information on Tweets and DMs (likes, retweets, time posted, etc.) will be displayed as well. For this project, I was given HTML and CSS that I reformatted to be used with Express and Pug.",
    skills: ['Node.js', 'Express', 'Pug/Jade', 'Twitter API']
  },
  {
    id: 8,
    title: 'Using Gulp to Build a Front End Website',
    description: "This project uses Gulp to streamline development of a website. It first takes Sass files and converts them to CSS. It then concatenates all CSS files into a single file, minimizes it, and creates a map to the source files. This process is repeated for the JavaScript as well. Finally, it places all the converted source files into a separate folder, then watches for any changes to the Sass files, ready to restart the server with the new styles.",
    skills: ['Gulp', 'Node.js', 'npm', 'build tools']
  },
  {
    id: 9,
    title: 'Create a Gallery App with React',
    description: "In this project, I created a single page app that uses React and the Flickr API to dynamically load pictures into a gallery. There are some preset options in the nav bar (Beach, Forest, Lake, etc), but users will also have the option use the search bar for their own queries. For this project, I was provided with an HTML file which I have broken down into React components. From there, my app will retrieve photos from Flikr and display them in a grid.",
    skills: ['React', 'React Router', 'Flickr API']
  },
  {
    id: 10,
    title: 'Build a Library Manager',
    description: "In this project, I was tasked with creating the database manager for a fictional library. The app tracks library patrons, books, and book loans. A user is able add new books, show all books, or display the status of books that are currently loaned out. They can also display all patrons or create a new one. Finally, they can create a new loan and display the status of all past and present loans. For this project I was provided with template HTML and CSS files which I converted into Pug for use with Express.",
    skills: ['SQL', 'SQLite', 'Sequelize', 'Express', 'Pug/Jade']
  },
  {
    id: 11,
    title: 'Build a Course Rating API With Express',
    description: "In this project, I built a REST API to handle requests for a course rating website. Users can create profiles, look up courses, or create a new course, look up reviews and even submit their own. The most complex route is when looking up a specific course. Here, a user will get all information on the course itself as well as information on the teacher (from the 'user' subdocument) and reviews of that course (from the 'review' subdocuments). Additionally, each review goes one level deeper to get name of the user that submitted it.",
    skills: ['MongoDB', 'Mongoose', 'REST API', 'Express']
  },
  {
    id: 12,
    title: 'Capstone Project: Build Your Own Web Application',
    description: "In my final project, I created a project that pulls together many of the things I have learned over the course of this Tech Degree program. My task is to access three APIs and present the data for the end-user. I first access Open Notify to find the current location of the ISS, find those coordinates in Google Maps, then use Open Weather to get the current and forecasted weather for that location. Additionally, users can save their favorite addresses and landmarks for easy access.",
    skills: ['JavaScript', 'jQuery', 'Bootstrap', 'CSS', 'Node.js', 'Express', 'MongoDB', 'APIs']
  }
];
