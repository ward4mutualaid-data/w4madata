import time
from pathlib import Path

from config import HERE_API_KEY
from geocode.here import HereClient

if __name__ == "__main__":
    submissions_file = "/home/amccarty/w4ma/test-here.txt"
    working_dir = Path("/home/amccarty/w4ma/batches/")

    client = HereClient(HERE_API_KEY, working_dir)
    request_id = client.send_batch(submissions_file)
    for i in range(30):
        status = client.get_job_status(request_id)
        if status.lower() == "completed":
            break
        time.sleep(10)

    result_path: Path = client.get_batch_result(request_id)
