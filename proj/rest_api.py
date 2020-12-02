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
                 "notes":notes})
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
    cases = i['cases']
    if cases == '':
        cases = 0
    else:
        cases = int(cases)
    deaths = i['deaths']
    if deaths == '':
        deaths = 0
    else:
        deaths = int(deaths)
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

#^^^---------------------------^^^

'''
@app.route('/md_covid_data.json', methods=['POST'])
def add_data():
  #each feature contains (new?) covid case counts for a single day, from each county
  data = json.loads(request.get_json())
  features = (data['features'])
  count = 0
  for i in features:
    print(i['properties'])
    print(type(i['properties']))
    #each feature should be a document in db
    #{'OBJECTID': 204, 'DATE': '2020/10/04 14:00:00+00', 'Allegany': 492, 'Anne_Arundel': 10376, 'Baltimore': 18354, 'Baltimore_City': 15954, 'Calvert': 1005, 'Caroline': 662, 'Carroll': 2003, 'Cecil': 1120, 'Charles': 2851, 'Dorchester': 614, 'Frederick': 4191, 'Garrett': 76, 'Harford': 3141, 'Howard': 5234, 'Kent': 309, 'Montgomery': 22976, 'Prince_Georges': 30004, 'Queen_Annes': 680, 'Somerset': 299, 'St_Marys': 1343, 'Talbot': 578, 'Washington': 1861, 'Wicomico': 2085, 'Worcester': 1082, 'Unknown': 0}
    i = i['properties']
    doc = mongo_covid.db.md_covid_data
    obj_id = i['OBJECTID']
    date = i['DATE']
    allegany = i['Allegany']
    anne_arundel = i['Anne_Arundel']
    baltimore = i['Baltimore']#double check
    baltimore_city = i['Baltimore_City']
    calvert = i['Calvert']
    caroline = i['Caroline']
    carroll = i['Carroll']
    cecil = i['Cecil']
    charles = i['Charles']
    dorchester = i['Dorchester']
    frederick = i['Frederick']
    garrett = i['Garrett']
    harford = i['Harford']
    howard = i['Howard']
    kent = i['Kent']
    montgomery = i['Montgomery']
    prince_georges = i['Prince_Georges']
    queen_annes = i['Queen_Annes']
    st_marys = i['St_Marys']
    somerset = i['Somerset']
    talbot = i['Talbot']
    washington = i['Washington']
    wicomico = i['Wicomico']
    worcester = i['Worcester']
    unknown = i['Unknown']

    
    doc.insert({'obj_id':obj_id, 'date':date,
                'counties':{
    'allegany':allegany,\
    'anne arundel':anne_arundel,\
    'baltimore':baltimore, \
    'baltimore city':baltimore_city, \
    'calvert':calvert, \
    'caroline':caroline,\
    'carroll':carroll,\
    'cecil':cecil,\
    'charles':charles,\
    'dorchester':dorchester,\
    'frederick':frederick, \
    'garrett':garrett, \
    'harford':harford,\
    'howard':howard,\
    'kent':kent, \
    'montgomery':montgomery,\
    'prince george\'s':prince_georges, \
    'queen anne\'s':queen_annes,\
    'st mary\'s':st_marys,\
    'somerset':somerset,\
    'talbot':talbot,\
    'washington':washington,\
    'wicomico':wicomico, \
    'worcester':worcester, \
                  'unknown': unknown}})

    count += 1
    
  return jsonify({'num_entries': count});
'''
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
