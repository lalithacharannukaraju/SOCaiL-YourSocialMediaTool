import requests
from bs4 import BeautifulSoup
import re
import csv
import time

def convert_count(text):
    match = re.search(r'(\d+(?:\.\d+)?)([KM]?)', text)
    if match:
        number = float(match.group(1))
        multiplier = match.group(2)
        if multiplier == 'K':
            return int(number * 1_000)
        elif multiplier == 'M':
            return int(number * 1_000_000)
        else:
            return int(number)
    return 0

def scrape_twitter_trends():
    url = 'https://trends24.in/india/'
    r = requests.get(url)
    soup = BeautifulSoup(r.content, 'html.parser')

    trends_section = soup.find_all('ol', class_='trend-card__list')

    trends = []
    for trend_list in trends_section:
        for trend in trend_list.find_all('li'):
            trend_text = trend.get_text(strip=True)
            match = re.match(r'^(.*?)(\d+(?:[KM]?)$)', trend_text)
            if match:
                trend_name = match.group(1).strip()
                trend_count = convert_count(match.group(2))
            else:
                trend_name = trend_text.strip()
                trend_count = 0
            trends.append([trend_name, trend_count])

    filename = r'twitter_scraper.csv'

    with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['Trend', 'Count'])
        writer.writerows(trends)

    print(f"Data has been stored in {filename}")

if __name__ == "__main__":
    print("Starting hourly Twitter scraping. Press Ctrl+C to stop.")
    try:
        while True:
            scrape_twitter_trends()
            print("Waiting 1 hour for next scrape...")
            time.sleep(3600)
    except KeyboardInterrupt:
        print("Stopped by user.")