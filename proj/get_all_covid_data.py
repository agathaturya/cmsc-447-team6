import requests
import json
import csv


if __name__ == "__main__":
    r = requests.get("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv")
    data = r.text.split("\n")[1:]
    data_list = []
    #date,county,state,fips,cases,deaths
#    print(len(data))

    print()
    #input()

    for row in data:
#        print(len(row))
        row = row.split(",")
        
        date = row[0]
        county = row[1]
        state = row[2]
        fips = row[3]
        cases = row[4]
        deaths = row[5]

        #print()
        entry = {"date": date, \
                 "county":county, "state":state, \
                 "fips":fips, "cases":cases, \
                 "deaths":deaths}
        data_list.append(entry)

        
        #input()
    formatted_json_data = {"data":data_list}
    print(formatted_json_data)
    input()
    
    formatted_json_data = json.dumps(formatted_json_data)
    print(formatted_json_data)
    input()

    
    l = requests.post("http://127.0.0.1:5000/us_counties_covid_data.json", \
                      headers={"content-type":"application/json"}, \
                      json=formatted_json_data)



        
