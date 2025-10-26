import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from http.server import BaseHTTPRequestHandler
import json

def get_times():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=opts)

    def getColumnOne(row):
        return f"/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[2]/table[2]/tbody/tr[6]/td/div/table/tbody/tr/td/table/tbody/tr[{row}]/td[1]/table/tbody/tr/th"

    times = []
    
    try:
        driver.get("https://ma-melrose.myfollett.com/aspen-login/?deploymentId=ma-melrose")

        wait = WebDriverWait(driver, 10)
        
        username_field = wait.until(EC.presence_of_element_located((By.ID, "username")))
        password_field = driver.find_element(By.ID, "password")
        
        # Credentials
        username_field.send_keys(os.environ.get("ASPEN_USERNAME"))
        password_field.send_keys(os.environ.get("ASPEN_PASSWORD"))
        
        login_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/go-root/go-login/go-login-container/div/div/div/go-default-login/form/div[4]/div/button"))
        )
        login_button.click()

        wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "navTab"))
        )
        
        my_info = driver.find_element(By.XPATH, "/html/body/div[3]/div/table[2]/tbody[3]/tr/td[3]/a")
        my_info.click()

        current_schedule = driver.find_element(By.XPATH, "/html/body/form/table/tbody/tr[2]/td/div/table[2]/tbody/tr[1]/td[1]/div/table/tbody/tr[3]/td/div")
        current_schedule.click()

        # Get schedule times
        for i in range(2, 8):
            element = driver.find_element(By.XPATH, getColumnOne(i))
            time_text = element.text.split("k-")[1]
            times.append(time_text)
                
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}
    finally:
        driver.quit()
    
    return times


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        times = get_times()
        data = {'times': times}
        self.wfile.write(json.dumps(data).encode())
        return