# import pandas, etc.
import pandas as pd
import os
import json

# Create relative file path
dirpath = os.getcwd()
filepath = os.path.join(dirpath, 'public/uploads/')

# Read excel and name columns
df = pd.read_excel(filepath + 'uploadedExcelFile.xlsx', index=False)
df.columns = ['key', 'value']

# Define lists
dictData = {}

# Create lists
for index, row in df.iterrows():
    if row['key'] in dictData:
        dictData[row['key']].append(str(row['value']))
    else:
        dictData[row['key']] = [str(row['value'])]

# Convert to JSON
jsonData = json.dumps(dictData)

# Create file
f = open("./public/json/data.json", "w+");

# Write JSON into file
f.write(jsonData)

# Close file
f.close()

print('Python script complete')
