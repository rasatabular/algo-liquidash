import os
import time

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from utils.db import get_watched_storage_account, read_all_users, read_storage_state

# stoarge account utilisation after which the account is considered to be
# in critical condition
CRITICAL_HEALTH = 0.8

# how frequent (in minutes) to check for the health of the accounts being
# watched and send email notifications
FREQUENCY = 60

# API KEY for Sendgrid
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')

# if in DEV mode, send notification emails to the DEV_EMAIL_ADDRESS to avoid
# sending emails to other addresses during development
DEV =  os.environ.get("DEV", "")
DEV_EMAIL_ADDRESS = os.environ.get('DEV_EMAIL_ADDRESS', "")

def send_notification_email(user_email_address, storage_addresses):

    content = 'The following storage addresses are in critical condition:\n' + '\n'.join(storage_addresses)

    message = Mail(
        from_email='no_reply@goaldata.org',
        to_emails=user_email_address,
        subject='AlgoFi Storage Addresses in Critical Condition',
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        print(f'Sending notification email to: {user_email_address}')
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)

# check which watched addresses are in critical condition
def check_watched_addresses(user_email_address):

    storage_addresses = get_watched_storage_account(user_email_address)

    # find the addresses that the user is watching who are in critical
    # health condition
    critical_health_addresses = []
    for doc in storage_addresses:
        storage_state_data = read_storage_state(doc['storage_account'])
        if storage_state_data['account_health']['percentage_borrowed'] > CRITICAL_HEALTH:
            critical_health_addresses.append(doc['storage_account'])

    return critical_health_addresses

def main_notify():

    # get all registered users
    registered_users = read_all_users()

    print(registered_users)

    # find addresses that are in critical health and send email
    for user_doc in registered_users:
        critical_health_addresses = check_watched_addresses(user_doc['username'])

        # if there are addresses in critical condition
        if len(critical_health_addresses) > 0:

            # send email to the user if not in DEV mode
            if not (DEV == "1"):
                send_notification_email(user_doc['username'], critical_health_addresses)
            if DEV == "1" and user_doc['username'] == DEV_EMAIL_ADDRESS:
                send_notification_email(user_doc['username'], critical_health_addresses)

if __name__ == '__main__':

    print('Starting notify process')

    while (True):
        main_notify()
        print(f'Notification done... sleep for {FREQUENCY} minutes')
        time.sleep(FREQUENCY * 60)
