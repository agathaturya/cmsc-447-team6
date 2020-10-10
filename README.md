# README
## Tools to install
### [mongo](https://www.mongodb.com/try/download/community)  
### [pip](https://pip.pypa.io/en/stable/installing/)  
### pymongo
- install it by running the command ```pip install pymongo``` or ```pip install Flask-PyMongo```   
### [flask](https://flask.palletsprojects.com/en/1.1.x/installation/)  
create the virtual env in the `proj` directory   
### flask cors
- install it by running the command ```pip install -U flask-cors```
### [node](https://www.npmjs.com/get-npm) 
### d3
- install it by running the command ```npm install d3```
### XMLHttpRequest  
 - install it by running the command ```npm install xmlhttprequest```
### d3-svg-legend
- install it by running the command ```npm i d3-svg-legend -S```
### browserify
- install it by running the command ```npm install -g browserify```
### [postman](https://www.postman.com/downloads/)  
- postman can be used to test API
### How to run it
0. Install all the tools needed
1. Clone this repo
2. Create a python virtual environment in the `proj` directory by running a command:
 - `python3 -m venv venv` on macOS/Linux  
 - `py -3 -m venv venv` on windows
3. Activate the python virtual environment by running a command 
 - `. venv/bin/activate` on macOS/Linux   
 - `venv\Scripts\activate` on windows
4. Navigate to the `proj` directory, and run the command `python3 rest_api.py`. This starts the flask server. **The python virtual environment must be active for the server to run.**
5. Open another terminal window, navigate to the `proj` directory, and run the command `node get_data.js`. This GETs data from the Maryland Covid API, and POSTs it to a locol mongo db.
6. In **Chrome**, open the `index.html` file from the `proj` directory. `ex.png` shows what the map should look like.
Steps 0, 1, 2, and 5 only have to be done once.  
This is what the terminal output should look like when the flask server is running, and the `index.html` file is open:  

```
(venv) ~/cmsc-447-team6/proj agatha: python3 rest_api.py 
 * Serving Flask app "rest_api" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 880-617-038
{'_id': ObjectId('5f7f4ff611bb663633f3a8f8'), 'obj_id': 10, 'date': '2020/03/24 14:00:00+00', 
'counties': {'allegany': None, 'anne arundel': 24, 'baltimore': 42, 'baltimore city': 41, 'calvert': 3, 'caroline': 1,  
'carroll': 5, 'cecil': 3, 'charles': 5, 'dorchester': None, 'frederick': 4, 'garrett': 3, 'harford': 5, 'howard': 30,  
'kent': None, 'montgomery': 107, "prince george's": 63, "queen anne's": 1, "st mary's": 2, 'somerset': 1, 'talbot': 1,  
'washington': 2, 'wicomico': 4, 'worcester': 2, 'unknown': None}}
127.0.0.1 - - [08/Oct/2020 15:26:17] "GET /get_by_id/10 HTTP/1.1" 200 -
```
