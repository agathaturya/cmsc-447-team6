#Date	Facility Type	State	Canonical Facility Name	Pop Tested	Pop Tested Positive	Pop Tested Negative	Pop Deaths	Pop Recovered	Staff Tested	Staff Tested Positive	Staff Tested Negative	Staff Deaths	Staff Recovered	Source	Compilation	Notes


import requests
import json


if __name__ == "__main__":
    csv_file = open("../data/Covid_Cases_and_Deaths_in_Criminal_Justice_Facilities_merged_data_prisons.csv", "r")

    file_contents = csv_file.readlines()
    csv_file.close()
    data_list = []
    for row in file_contents:

        row = row.split(",")
        for i in range(len(row)):
            if row[i] == "" and i in [4,5,6,7,8,9,10,11,12,13]:
                row[i] = 0
        date = row[0]
        facility_type = row[1]
        state = row[2]
        canonical_facility_name = row[3]
        pop_tested = row[4]
        pop_tested_positive = row[5]
        pop_tested_negative = row[6]
        pop_deaths = row[7]
        pop_recovered = row[8]
        staff_tested = row[9]
        staff_tested_positive = row[10]
        staff_tested_negative = row[11]
        staff_deaths = row[12]
        staff_recovered = row[13]
        source = row[14]
        compilation = row[15]
        notes = row[16]
        


        
        
        entry = {"date":date,\
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
                 "notes":notes}
        
        data_list.append(entry)
    print(len(data_list))
    formatted_json_data = {"data":data_list}
    formatted_json_data = json.dumps(formatted_json_data)
    
    l = requests.post("http://127.0.0.1:5000/prison_covid_data.json", \
                    headers={"content-type":"application/json"}, \
                    json=formatted_json_data)
    
    
        
        