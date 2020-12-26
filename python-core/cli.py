import time

from config import HERE_API_KEY
from geocode.here import HereClient

if __name__ == "__main__":
    client = HereClient(HERE_API_KEY)
    request_id = client.send_batch("/home/amccarty/w4ma/test-here.txt")
    for i in range(30):
        status = client.get_job_status(request_id)
        if status.lower() == "completed":
            break
        time.sleep(10)
