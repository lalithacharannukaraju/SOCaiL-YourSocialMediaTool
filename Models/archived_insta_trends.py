import requests
import csv
from bs4 import BeautifulSoup

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

    archived_trends_section = soup.find('h2', id="past-instagram-reels-trends")

    if archived_trends_section:
        archived_trends = []
        for sibling in archived_trends_section.find_next_siblings():
            if sibling.name == 'h2':  # Stop when we hit the next h2
                break
            if sibling.name == 'p':
                trend_info = extract_trend_info(sibling)
                if trend_info:
                    archived_trends.append(trend_info)

        filename = 'archived_insta_trends.csv'
        with open(filename, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['Trend Name', 'Links', 'Explanation'])
            writer.writerows(archived_trends)

        print(f"Archived trends data has been stored in {filename}")
    else:
        print("Couldn't find the 'Past Instagram Reels Trends' section")
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")