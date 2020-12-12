
#Creates a dictionary with key values as state and county, value is the fips number
#csv source: https://github.com/kjhealy/fips-codes/blob/master/county_fips_master.csv

import csv

def createFipsDict():

    csv_file = open("county_fips_master.csv", "r", encoding="utf-8", errors='ignore')
    
    file_contents = csv_file.readlines()
    
    csv_file.close()

    #Create dictionary for counties and their respective fips number
    countyFips = { ("County", "State") : "00000" }

    for row in file_contents:
        row = row.split(",")

        #if fips number is 4 digit (1234), make it 5 digit (01234)
        if len(row[0]) != 5:
            row[0] = '0' + row[0]

        countyFips[ (row[1], row[3]) ] = row[0]

    return countyFips


def createPrisonDict(prisonData):

    #Create dictionary for prisons, state, and respective county
    prisonState = { ("Facility_Name", "State") : "County" }

    for each in prisonData:

        prisonState[ (each["facility_name"], each["name"]) ] = each["county"]

    return prisonState


if __name__ == "__main__":

    #example search
    countyFipsDict = createFipsDict()
    #print(countyFipsDict)
    print(countyFipsDict[("Greene County", "Mississippi")])    
