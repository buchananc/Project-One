  
       const add_to_calendar = $('#scheduleMealBtn'); // Button on modal when user choses meal already chosen
    
       
        // Client ID and API key from the Developer Console
        var CLIENT_ID = '789203245949-j3bbkl52c17okp8fdgvapmrctv2ckt16.apps.googleusercontent.com';
        var API_KEY = 'AIzaSyCrso6A5odYwjDGvRAqC6-vMufGfTNZhfA';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar profile email";



       /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,  
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            newEvent();
            
        } else {
            // user is not authenticated
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      const newEvent = function() {

        const summary = eventObj.summary;
        const description = eventObj.description;
        const startTime = eventObj.startTime;
        const endTime = eventObj.endTime;

            var event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': startTime,
                    'timeZone': 'America/New_York'
                },
                'end': {
                    'dateTime': endTime,
                    'timeZone': 'America/New_York'
                }
            };
            
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });


            request.execute(function(event) {
                // Don't need to do anything here
              });
               
        }