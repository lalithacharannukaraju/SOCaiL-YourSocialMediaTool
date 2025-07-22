from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import json
import datetime
import schedule
import subprocess
import threading

def scrape_instagram_story(username):
    # Set up Selenium WebDriver
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    driver = webdriver.Chrome()
    driver.get("https://anonyig.com/en/")

    try:
        # Locate the search input and perform a search
        search_input = driver.find_element(By.CLASS_NAME, "search-form__input")
        search_input.send_keys(username)
        search_input.send_keys(Keys.RETURN)

        # Wait for the results to load
        time.sleep(20)

        # Parse results for media content
        media_items = driver.find_elements(By.CLASS_NAME, "media-content")
        user_data = {
            "username": username,
            "engagement": []
        }

        for item in media_items:
            try:
                likes = item.find_element(By.CLASS_NAME, "media-content__meta-like").text.strip()
                comments = item.find_element(By.CLASS_NAME, "media-content__meta-comment").text.strip()
                time_posted = item.find_element(By.CLASS_NAME, "media-content__meta-time").text.strip()

                # Convert and filter by time range (past month)
                post_date = datetime.datetime.strptime(time_posted, "%b %d, %Y")
                if (datetime.datetime.now() - post_date).days <= 30:
                    user_data["engagement"].append({
                        "likes": likes,
                        "comments": comments,
                        "time": time_posted
                    })
            except Exception as e:
                print(f"Error processing media item: {e}")

        # Save data to JSON
        with open(f"{username}_engagement.json", "w", encoding="utf-8") as f:
            json.dump(user_data, f, ensure_ascii=False, indent=4)

        print(f"Data saved to {username}_engagement.json")

    except Exception as e:
        print(f"Error during scraping: {e}")

    finally:
        driver.quit()

def run_all_scrapers():
    print('Running all scrapers...')
    subprocess.run(['python', 'Models/twitter_scraper.py'])
    subprocess.run(['python', 'Models/instagram_trending_songs.py'])
    subprocess.run(['python', 'Models/latest_insta_trends.py'])
    subprocess.run(['python', 'Models/archived_insta_trends.py'])
    print('All scrapers completed.')

# Schedule all scrapers to run every 30 minutes
schedule.every(30).minutes.do(run_all_scrapers)

def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    # Optionally, run once at startup
    run_all_scrapers()
    # Start the scheduler in the main thread
    run_scheduler()
