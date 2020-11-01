# README
## Tools to install
### [mongo](https://www.mongodb.com/try/download/community)  
### [pip](https://pip.pypa.io/en/stable/installing/)  
### pymongo
- install it by running the command ```pip install pymongo``` or ```pip install Flask-PyMongo```   
### [flask](https://flask.palletsprojects.com/en/1.1.x/installation/)  
create the virtual env in the `proj` directory. **create the virtual env before installing the rest of the python packages** 
### flask cors
- install it by running the command ```pip install -U flask-cors```
### requests
- install it by running the command ```pip install requests```
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
### react-calender
- install it by running the command ```npm install react-calender```
### express
install it by running the command ```npm install --save express```

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
5. While the flask server is running, open another terminal window, navigate to the `proj` directory, and run the command `python3 get_all_covid_data.py`. This GETs data from the NYT Covid dataset, and POSTs it to a locol mongo db.
6. While the flask server is running, run the ```get_prison_data.py``` and ```get_covid_prison_data.py``` files by running the command ```python3 get_prison_data.py```, and ```python3 get_covid_prison_data.py```. This GETs the prison data webpage, gets rid of HTML tags, reads covid prison data from ```data/Covid_Cases_and_Deaths_in_Criminal_Justice_Facilities_merged_data_prisons.csv``` and POSTs them to a local mongo db.
7. In **Chrome**, open the `index.html` file from the `proj` directory.
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
{'_id': ObjectId('5f95cbf32bae17dd2e25d360'), 'date': '2020-06-20', 'county': 'Autauga', 'state': 'Alabama', 'fips': '01001', 'cases': '431', 'deaths': '9'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d361'), 'date': '2020-06-20', 'county': 'Baldwin', 'state': 'Alabama', 'fips': '01003', 'cases': '420', 'deaths': '9'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d362'), 'date': '2020-06-20', 'county': 'Barbour', 'state': 'Alabama', 'fips': '01005', 'cases': '272', 'deaths': '1'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d363'), 'date': '2020-06-20', 'county': 'Bibb', 'state': 'Alabama', 'fips': '01007', 'cases': '126', 'deaths': '1'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d364'), 'date': '2020-06-20', 'county': 'Blount', 'state': 'Alabama', 'fips': '01009', 'cases': '143', 'deaths': '1'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d365'), 'date': '2020-06-20', 'county': 'Bullock', 'state': 'Alabama', 'fips': '01011', 'cases': '327', 'deaths': '10'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d366'), 'date': '2020-06-20', 'county': 'Butler', 'state': 'Alabama', 'fips': '01013', 'cases': '572', 'deaths': '26'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d367'), 'date': '2020-06-20', 'county': 'Calhoun', 'state': 'Alabama', 'fips': '01015', 'cases': '211', 'deaths': '4'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d368'), 'date': '2020-06-20', 'county': 'Chambers', 'state': 'Alabama', 'fips': '01017', 'cases': '516', 'deaths': '27'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d369'), 'date': '2020-06-20', 'county': 'Cherokee', 'state': 'Alabama', 'fips': '01019', 'cases': '58', 'deaths': '6'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36a'), 'date': '2020-06-20', 'county': 'Chilton', 'state': 'Alabama', 'fips': '01021', 'cases': '163', 'deaths': '3'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36b'), 'date': '2020-06-20', 'county': 'Choctaw', 'state': 'Alabama', 'fips': '01023', 'cases': '186', 'deaths': '12'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36c'), 'date': '2020-06-20', 'county': 'Clarke', 'state': 'Alabama', 'fips': '01025', 'cases': '214', 'deaths': '4'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36d'), 'date': '2020-06-20', 'county': 'Clay', 'state': 'Alabama', 'fips': '01027', 'cases': '31', 'deaths': '2'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36e'), 'date': '2020-06-20', 'county': 'Cleburne', 'state': 'Alabama', 'fips': '01029', 'cases': '22', 'deaths': '1'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d36f'), 'date': '2020-06-20', 'county': 'Coffee', 'state': 'Alabama', 'fips': '01031', 'cases': '315', 'deaths': '1'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d370'), 'date': '2020-06-20', 'county': 'Colbert', 'state': 'Alabama', 'fips': '01033', 'cases': '302', 'deaths': '5'}
{'_id': ObjectId('5f95cbf32bae17dd2e25d371'), 'date': '2020-06-20', 'county': 'Conecuh', 'state': 'Alabama', 'fips': '01035', 'cases
```
