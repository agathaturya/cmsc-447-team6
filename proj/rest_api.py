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

app.config['MONGO_DBNAME'] = 'md_covid_data'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/md_covid_data'
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
mongo = PyMongo(app)


#get by obj_id
@app.route('/get_by_id/<obj_id>', methods=['GET'])
def get_by_obj_id(obj_id):

  obj_id = int(obj_id)
  covid_data = mongo.db.md_covid_data
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
    doc = mongo.db.md_covid_data
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
if __name__ == '__main__':
    app.run(debug=True)
