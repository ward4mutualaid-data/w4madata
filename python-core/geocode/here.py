import requests


class HereClient:
    batch_geocode_url = "https://batch.geocoder.ls.hereapi.com/6.2/jobs/"
 
    def __init__(self, api_key: str):
        self.api_key = api_key

    def send_batch(self, file_path: str) -> str:
        """Send a batch of addresses to be geocoded and return the Request ID"""
        path = open(file_path, "rb")
        resp = requests.post(
            self.batch_geocode_url,
            params={
                "apiKey": self.api_key,
                "indelim": "|",
                "outdelim": "|",
                "action": "run",
                "outcols": "displayLatitude,displayLongitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,country",
                "outputcombined": True
            },
            data=path,
            headers={
                "Content-Type": "text/plain"
            }
        )
        print(resp.status_code)
        print(resp.text)
