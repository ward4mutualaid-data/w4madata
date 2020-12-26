from config import HERE_API_KEY
from geocode.here import HereClient


if __name__ == "__main__":
    client = HereClient(HERE_API_KEY)
    client.send_batch("/home/amccarty/w4ma/test-here.txt")
