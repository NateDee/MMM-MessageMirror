'''
Reading GMAIL using Python
	- Abhishek Chhibber
'''

'''
This script does the following:
- Go to Gmal inbox
- Find and read all the unread messages
- Extract details (Date, Sender, Subject, Snippet, Body) and export them to a .csv file / DB
- Mark the messages as Read - so that they are not read again 
'''

'''
Before running this script, the user should get the authentication by following 
the link: https://developers.google.com/gmail/api/quickstart/python
Also, client_secret.json should be saved in the same directory as this file
'''

# Importing required libraries
from googleapiclient import discovery
from googleapiclient import errors
from httplib2 import Http
from oauth2client import file, client, tools
import base64
import re
import time
import dateutil.parser as parser
from datetime import datetime
import datetime
import csv

import sys
if sys.version_info[0] > 2:
    # py3k
    pass
else:
    # py2
    import codecs
    import warnings
    def open(file, mode='r', buffering=-1, encoding=None,
             errors=None, newline=None, closefd=True, opener=None):
        if newline is not None:
            warnings.warn('newline is not supported in py2')
        if not closefd:
            warnings.warn('closefd is not supported in py2')
        if opener is not None:
            warnings.warn('opener is not supported in py2')
        return codecs.open(filename=file, mode=mode, encoding=encoding,
                    errors=errors, buffering=buffering)


# Creating a storage.JSON file with authentication details
SCOPES = 'https://www.googleapis.com/auth/gmail.modify' # we are using modify and not readonly, as we will be marking the messages Read
store = file.Storage('storage.json') 
creds = store.get()
if not creds or creds.invalid:
    flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
    creds = tools.run_flow(flow, store)
GMAIL = discovery.build('gmail', 'v1', http=creds.authorize(Http()))

user_id =  'me'
label_id_one = 'INBOX'
label_id_two = 'UNREAD'

# Getting all the unread messages from Inbox
# labelIds can be changed accordingly
unread_msgs = GMAIL.users().messages().list(userId='me',labelIds=[label_id_one, label_id_two]).execute()

# We get a dictonary. Now reading values for the key 'messages'
mssg_list = unread_msgs['messages']

# print ("Total unread messages in inbox: ", str(len(mssg_list)))

final_list = [ ]


for mssg in mssg_list:
	temp_dict = { }
	m_id = mssg['id'] # get id of individual message
	message = GMAIL.users().messages().get(userId=user_id, id=m_id).execute() # fetch the message using API
	payld = message['payload'] # get payload of the message 
	headr = payld['headers'] # get header of the payload


	for one in headr: # getting the Subject
		if one['name'] == 'Subject':
			msg_subject = one['value']
			temp_dict['Subject'] = msg_subject
		else:
			pass


	for two in headr: # getting the date
		if two['name'] == 'Date':
			msg_date = two['value']
			date_parse = (parser.parse(msg_date))
			m_date = (date_parse.date())
			temp_dict['Date'] = str(m_date)
		else:
			pass

	for three in headr: # getting the Sender
		if three['name'] == 'From':
			msg_from = three['value']
			temp_dict['Sender'] = msg_from
		else:
			pass

	temp_dict['Snippet'] = message['snippet'] # fetching message snippet


			
	# Fetching message body
	message2 = GMAIL.users().messages().get(userId=user_id, id=m_id, format='raw').execute()
	msg_str = base64.urlsafe_b64decode(message2['raw'].encode('ASCII'))
	try:
            temp_dict['Message_body'] = msg_str.decode().split("...")[1]
	except :
            pass
	
	final_list.append(temp_dict['Sender'][1:15])
	final_list.append(temp_dict['Message_body'])
		
	# This will mark the message as read
	GMAIL.users().messages().modify(userId=user_id, id=m_id,body={ 'removeLabelIds': ['UNREAD']}).execute() 
	


print (final_list)
#print ("Total messaged retrived: ", str(len(final_list)))
'''

The final_list will have dictionary in the following format:

{	'Sender': '"email.com" <name@email.com>', 
	'Subject': 'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet', 
	'Date': 'yyyy-mm-dd', 
	'Snippet': 'Lorem ipsum dolor sit amet'
	'Message_body': 'Lorem ipsum dolor sit amet'}


The dictionary can be exported as a .csv or into a databse
'''

#exporting the values as .csv
#with open('CSV_NAME.csv', 'w', encoding='utf-8', newline = '') as csvfile: 
#    fieldnames = ['Sender','Subject','Date','Snippet','Message_body']
#    writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter = ',')
#    writer.writeheader()
#    for val in final_list:
#    	writer.writerow(val)
