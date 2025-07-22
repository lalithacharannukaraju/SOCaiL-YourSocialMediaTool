import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

url = "https://socialbu.com/blog/trending-songs-on-instagram-reels/"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")
songs_data = []

def convert_to_numeric(value):
    try:
        value = value.upper()
        if 'K' in value:
            return int(float(value.replace('K', '').replace(',', '')) * 1000)
        elif 'M' in value:
            return int(float(value.replace('M', '').replace(',', '')) * 1000000)
        else:
            return int(value.replace(',', ''))
    except ValueError:
        return None

song_sections = soup.find_all("li")
for i in range(0, len(song_sections), 2):
    song_info = song_sections[i].find("a")
    if song_info:
        song_text = song_info.get_text(strip=True)
        song_link = song_info['href']

        if 'instagram.com' not in song_link:
            continue

        if ' - ' in song_text:
            song_name, artist_name = song_text.split(' - ', 1)
        else:
            song_name = song_text
            artist_name = "Unknown"

        if i + 1 < len(song_sections):
            reels_count_text = song_sections[i + 1].get_text(strip=True)
            reels_count_text = reels_count_text.replace(',', '').replace('# of Reels:', '').strip()
            reels_count = convert_to_numeric(reels_count_text)

            if reels_count is None:
                continue
        else:
            reels_count = 0
        paragraph = song_sections[i].find_next("p")
        description = paragraph.get_text(strip=True) if paragraph else ""
        likes_element = paragraph.find_next("strong") if paragraph else None
        likes = likes_element.get_text(strip=True) if likes_element else "N/A"

        songs_data.append({
            "song_name": song_name,
            "artist_name": artist_name,
            "reels_count": reels_count,
            "song_link": song_link,
            "description": description,
            "likes": likes
        })

df = pd.DataFrame(songs_data)
df = df.sort_values(by="reels_count", ascending=False)
df.to_csv("instagram_trending_songs.csv", index=False)
print("Data saved successfully in CSV and JSON formats.")