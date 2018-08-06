## Project 12
### Build a Course Rating API With Express

In this project, I have built a REST API to handle requests for a course rating website. Users can create profiles, look up courses or create a new one, look up reviews and even submit their own. When looking up a specific course (the most complex route), you will get all information on the course itself as well as the information on the teacher ('user' subdocument) and the reviews ('review' subdocuments). Additionally, reviews go one level deeper to get info on the user that submitted them. Inception.

This project ended up being a bit of a struggle for me, but here on the other side of it I'm glad for it. I have learned a lot about MongoDB and Mongoose, and am glad to have the extra practice with Express! One more project to go!

*__Skills:__ JavaScript, jQuery, Bootstrap 4, CSS, Node.js, Express, MongoDB, APIs*

*__Personal Development Emphasis:__ Review of Express, MongoDB, using APIs, handling https to http and CORS requests*

---

__Grade:__

__Grader's Overall Comments:__

---

#### _Special Instructions for Setup_

For deployment on your local machine you will need to set a few variables. First, request free API keys from both Google Maps (https://cloud.google.com/console/google/maps-apis/overview) and Open Weather (https://openweathermap.org/price). Once you have those, place them into the "config.env" file and rename it as ".env". Finally, start up your MongoDB Daemon and you're ready to go! Note that if your MongoDB Daemon is running on a different port you will need to change that in the ".env" file.
