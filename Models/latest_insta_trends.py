import requests
import csv
from bs4 import BeautifulSoup
import re

url = 'https://slayingsocial.com/instagram-reels-trends/'
response = requests.get(url)

def extract_trend_info(p_tag):
    strong = p_tag.find('strong')
    if strong:
        trend_name = strong.get_text(strip=True)
        links = strong.find_all('a', href=True)
        hrefs = [link['href'] for link in links]
        explanation = p_tag.get_text(strip=True).replace(trend_name, '', 1).strip()
        return [trend_name, ','.join(hrefs), explanation]
    return None

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the h2 tag with id matching the pattern "current-instagram-reels-trends-*"
    latest_trends_section = soup.find('h2', id=re.compile(r'current-instagram-reels-trends-.*'))

    if latest_trends_section:
        latest_trends = []
        for sibling in latest_trends_section.find_next_siblings():
            if sibling.name == 'h2':  # Stop when we hit the next h2
                break
            if sibling.name == 'p':
                trend_info = extract_trend_info(sibling)
                if trend_info:
                    latest_trends.append(trend_info)

        filename = 'latest_insta_trends.csv'
        with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['Trend Name', 'Links', 'Explanation'])
            writer.writerows(latest_trends)

        print(f"Latest trends data has been stored in {filename}")
    else:
        print("Couldn't find the current Instagram Reels Trends section")
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")