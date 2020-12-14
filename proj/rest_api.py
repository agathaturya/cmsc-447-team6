# mongo.py
#TODO: change md_covid_data --> md_county_covid_data
#dont put data if obj already exists
#change names to match county names in other json file
from flask import Flask
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import json
import datetime

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
mongo_covid = PyMongo(app, uri="mongodb://localhost:27017/md_covid_data")
mongo_prison = PyMongo(app, uri="mongodb://localhost:27017/prison_data")
mongo_us_covid = PyMongo(app, uri="mongodb://localhost:27017/us_counties_covid_data")
mongo_prison_covid =  PyMongo(app, uri="mongodb://localhost:27017/prison_covid_data")
cors = CORS(app)

#get covid prison data
@app.route('/get_prison_covid_data/', methods=['GET'])
def get_prison_covid_data():
  result = []
  doc = mongo_prison_covid.db.prison_covid_data
  for i in doc.find():
    print(i)
    result.append(i)

  return json.dumps(result, default=str)


#get prison covid data by date
#date needs to be formatted like this:YYYY-MM-DD   
@app.route('/get_prison_covid_data_by_date/<date>/', methods=['GET'])
def get_prison_covid_data_by_date(date):
  result = []
  doc = mongo_prison_covid.db.prison_covid_data
  d = datetime.datetime.strptime(date, "%Y-%m-%d")
  for i in doc.find({'date':d}):
    print(i)
    result.append(i)

  return json.dumps(result, default=str)

#post covid prison data
@app.route('/prison_covid_data.json', methods=['POST'])
def post_prison_covid_data():
  data = json.loads(request.get_json())
  data = data["data"]
  doc = mongo_prison_covid.db.prison_covid_data
  count = 0

  for i in data:

    date  = i['date']
    d = datetime.datetime.strptime(date, "%Y-%m-%d")

    facility_type = i['facility_type']
    state = i['state']
    canonical_facility_name = i['canonical_facility_name']
    pop_tested = i['pop_tested']
    pop_tested_positive = i['pop_tested_positive'] 
    pop_tested_negative = i['pop_tested_negative']
    pop_deaths = i['pop_deaths']
    pop_recovered = i['pop_recovered']
    staff_tested = i['staff_tested']
    staff_tested_positive = i['staff_tested_positive']
    staff_tested_negative = i['staff_tested_negative']
    staff_deaths = i['staff_deaths']
    staff_recovered = i['staff_recovered']
    source = i['source']
    compilation = i['compilation']
    notes = i['notes']
    county = i['county']
    fips = i['fips']

    doc.insert({"date":d,\
                 "facility_type":facility_type,\
                 "state":state,\
                 "canonical_facility_name":canonical_facility_name,\
                 "pop_tested":pop_tested,\
                 "pop_tested_positive":pop_tested_positive,\
                 "pop_tested_negative":pop_tested_negative,\
                 "pop_deaths":pop_deaths,\
                 "pop_recovered":pop_recovered,\
                 "staff_tested":staff_tested,\
                 "staff_tested_positive":staff_tested_positive,\
                 "staff_tested_negative":staff_tested_negative,\
                 "staff_deaths":staff_deaths,\
                 "staff_recovered":staff_recovered,\
                 "source":source,\
                 "compilation":compilation,\
                 "notes":notes, \
                 "county": county, \
                 "fips":fips})

    count += 1
  print(count)
  return jsonify({'num_entries': count});

#post national covid data
@app.route('/us_counties_covid_data.json', methods=['POST'])
def post_national_covid_data():
  data = json.loads(request.get_json())
  data = data["data"]
  doc = mongo_us_covid.db.us_counties_covid_data
  count = 0
  for i in data:
    print(i)
        
    date = i['date']
    date = date.strip()
    d = datetime.datetime.strptime(date, "%Y-%m-%d")
    
    county = i['county']
    state = i['state']
    fips = i['fips']
    cases = int(i['cases'])
    deaths = int(i['deaths'])
    x = doc.insert( {"date": d, \
                 "county":county, "state":state, \
                 "fips":fips, "cases":cases, \
                 "deaths":deaths})
    count += 1
  print(count)
  return jsonify({'num_entries': count});


#get national covid data by date
#date param needs to be formatted like this:YYYY-MM-DD
@app.route('/get_us_data_by_date/<date>/', methods=['GET'])
def get_us_counties_covid_data_by_date(date):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  d = datetime.datetime.strptime(date, "%Y-%m-%d")
  for i in doc.find({'date':d}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get national covid data
@app.route('/get_us_data/', methods=['GET'])
def get_us_counties_covid_data():
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find():
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)


#VVV----------Filters added by Leon----------VVV

#get data filted by county
#county param needs to be formatted like this: 'Baldwin'
@app.route('/get_us_data_by_county/<county>/', methods=['GET'])
def get_us_counties_covid_data_by_county(county):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({'county':str(county)}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data filted by state
#state param needs to be formatted like this: 'Maryland'
@app.route('/get_us_data_by_state/<state>/', methods=['GET'])
def get_us_counties_covid_data_by_state(state):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({'state':str(state)}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data filted by fips
#fips param needs to be formatted like this: '01001'
@app.route('/get_us_data_by_fips/<fips>/', methods=['GET'])
def get_us_counties_covid_data_by_fips(fips):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({'fips':str(fips)}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by specific number of cases
#cases param needs to be formatted like this: 140
@app.route('/get_us_data_by_cases/<cases>/', methods=['GET'])
def get_us_counties_covid_data_by_cases(cases):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({'cases':int(cases)}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by decending cases (most to least)
@app.route('/get_us_data_by_cases_D/<cases>/', methods=['GET'])
def get_us_counties_covid_data_by_cases_D():
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({ }.sort({'cases':-1})):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by accending cases (least to most)
@app.route('/get_us_data_by_cases_A/<cases>/', methods=['GET'])
def get_us_counties_covid_data_by_cases_A():
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({ }.sort({'cases':1})):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by specific number of deaths
#deaths param needs to be formatted like this: 20
@app.route('/get_us_data_by_deaths/<deaths>/', methods=['GET'])
def get_us_counties_covid_data_by_deaths(deaths):
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({'deaths':int(deaths)}):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by decending deaths (most to least)
@app.route('/get_us_data_by_deaths_D/<deaths>/', methods=['GET'])
def get_us_counties_covid_data_by_deaths_D():
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({ }.sort({'deaths':-1})):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get data sorted by accending deaths (least to most)
@app.route('/get_us_data_by_deaths_A/<deaths>/', methods=['GET'])
def get_us_counties_covid_data_by_deaths_A():
  result = []
  doc = mongo_us_covid.db.us_counties_covid_data
  for i in doc.find({ }.sort({'deaths':1})):
    print(i)
    print()
    print()
    result.append(i)
  return json.dumps(result, default=str)

#get prison data
@app.route('/get_prison_data/', methods=['GET'])
def get_prison_data():
  result = []
  doc = mongo_prison.db.prison_data
  for i in doc.find():
    #print(i)
    result.append(i)

  return json.dumps(result, default=str)

#post prison data
@app.route('/prison_data.json', methods=['POST'])
def post_prison_data():
    
    json_file = json.loads(request.get_json())
    
    data = (json_file['data'])
  
    count = 0
    for i in data:
        print(i)
        #{'name': 'Alabama', '
        #county': 'Autauga County', 
        #'tract': '020200', 
        #'block': '2008', 
        #'correctional_population': '181', 
        #'facility_name': 'Autauga Metro Jail', '
        #facility_type': 'Local', 
        #'wrong_block': '', 
        #'comment': ''}
        name = i['name']
        county = i['county']
        tract = i['tract']
        block = i['block']
        correctional_population = i['correctional_population']
        facility_name = i['facility_name']
        facility_type = i['facility_type']
        wrong_block = i['wrong_block']
        comment = i['comment']


        doc = mongo_prison.db.prison_data

        doc.insert({"name":name,\
        "county":county,\
        "tract":tract,\
        "block": block, \
        "correctional_population":int(correctional_population),\
        "facility_name":facility_name,
        "facility_type":facility_type,
        "wrong_block":wrong_block,
        "comment":comment
        })
        
        count+=1

    return jsonify({'num_entries': count});  
        
        
    
if __name__ == '__main__':
    app.run(debug=True)
