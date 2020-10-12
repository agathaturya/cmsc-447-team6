#webscraper that gets prison data from https://www.prisonersofthecensus.org/locator2010/states/starts-with- 
import requests
import json
if __name__ == '__main__':
    r = requests.get("https://www.prisonersofthecensus.org/locator2010/states/starts-with-/")
    body = r.text.split("<body>")
    
    page = body[1].split("<div id=\"page\">")
    

 
    table = page[1].split("<table class=\"nohover appendix\">")
    table_body = table[1].split("<tbody>")
    table_contents = table_body[0]
    

    table_cells = table_contents.split("<tr>")
    table_cells = table_cells[2:]
    jail_list = []
 

    for i in table_cells:
        #here's how one prison is formatted:
        #'Alabama</td>\t',
        #'Autauga County</td>\t',
        #'<a target="_blank" href="http://factfinder2.census.gov/bkmk/sm/1.0/en?mapyear=2010&extenttype=geo&gslcode=140&geoids=1400000US01001020200&by=140&bl=140">020200</a></td>\t',
        #'2008</td>\t',
        #'181</td>\t',
        #'Autauga Metro Jail</td>\t',
        #'Local</td>\t',
        #'</td>\t',
        #'</td>\t',
        #'<a href="/locator2010/edit/010010202002008/">Edit</a></td>\t',
        #'<a href="/locator2010/map/010010202002008/">Map</a></td>\t',
        #'<a href="/locator2010/map.html?geoid=010010202002008&inc2000=true">Map Compare 2000 to 2010</a></td>\t',
        #'<a href="/locator2010/map.html?geoid=010010202002008&incFacilities=true">TIGER Facility Footprints</a></td>\t',
        #'<a href="/data/2010blocks/010010202002008/">Detail</a></td></tr>']
        unformatted_jail = i.split("<td>")[1:]
        
        name = unformatted_jail[0].strip("</td>\t")
        county = unformatted_jail[1].strip("</td>\t")
        temp_tract = unformatted_jail[2].strip("</a></td>\t")
        
        tract = ""
        found = False
        
        for i in temp_tract:

            if not found:   
                if(i == ">"):
                    found = True
            else:
                tract += i

        
        block = unformatted_jail[3].strip("</td>\t")
        correctional_population = unformatted_jail[4].strip("</td>\t").replace(",", "")
        facility_name = unformatted_jail[5].strip("</td>\t")
        facility_type = unformatted_jail[6].strip("</td>\t")
        wrong_block = unformatted_jail[7].strip("</td>\t")
        comment = unformatted_jail[8].strip("</td>\t")
        
        jail = { "name": name, "county": county, "tract":tract, "block": block, "correctional_population":correctional_population,\
                "facility_name":facility_name, "facility_type":facility_type, "wrong_block":wrong_block, "comment": comment
                }
        
        jail_list.append(jail)


    
    formatted_json_data = {"data":jail_list}
    formatted_json_data = json.dumps(formatted_json_data)


    l = requests.post('http://127.0.0.1:5000/prison_data.json',headers={"content-type":"application/json"}, json=formatted_json_data)
        
    print(l)
    print(l.json())


