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
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
mongo_covid = PyMongo(app, uri="mongodb://localhost:27017/md_covid_data")
mongo_prison = PyMongo(app, uri="mongodb://localhost:27017/prison_data")

cors = CORS(app)


#get by obj_id
@app.route('/get_by_id/<obj_id>', methods=['GET'])
def get_by_obj_id(obj_id):

  obj_id = int(obj_id)
  covid_data = mongo_covid.db.md_covid_data
  result = covid_data.find_one({'obj_id' : obj_id})
  print(result)

  if result:
    output = result
  else:
    output = "No document found"
  
  return json.dumps(output, default=str)

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
