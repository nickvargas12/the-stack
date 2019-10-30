#! /usr/bin/env python3

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
import unittest
import re

page_num = 1
timeout = 10

driver = webdriver.Chrome('./chromedriver')
# have selenium get the department website
# driver.get("https://sa.ucla.edu/ro/Public/SOC/Results?t=19F&sBy=subject&sName=Computer+Science+%28COM+SCI%29&subj=COM+SCI&crsCatlg=Enter+a+Catalog+Number+or+Class+Title+%28Optional%29&catlg=&cls_no=&btnIsInIndex=btn_inIndex")
driver.get("https://sa.ucla.edu/ro/Public/SOC/Results?t=19F&sBy=subject&sName=Mathematics+%28MATH%29&subj=MATH&crsCatlg=Enter+a+Catalog+Number+or+Class+Title+%28Optional%29&catlg=&cls_no=&btnIsInIndex=btn_inIndex")
# driver.get("https://sa.ucla.edu/ro/Public/SOC/Results?t=19F&sBy=subject&sName=English+%28ENGL%29&subj=ENGL&crsCatlg=Enter+a+Catalog+Number+or+Class+Title+%28Optional%29&catlg=&cls_no=&btnIsInIndex=btn_inIndex")
driver.maximize_window()
# iterate through all the pages in the department
all_pages = driver.find_element_by_class_name("jPag-pages")
pages = all_pages.find_elements_by_tag_name("li")
num_pages = len(pages)
open_classes = 0
closed_classes = 0
while(page_num <= num_pages):
    wait = WebDriverWait(driver, timeout)
    # wait for up to 3 seconds for the page to be clickable
    page_string = "ul.jPag-pages li:nth-child(" + str(page_num) + ")"
    wait.until(EC.visibility_of_element_located(
        (By.CSS_SELECTOR, page_string)))
    actions = ActionChains(driver)
    cur_page = driver.find_element_by_css_selector(
        page_string)
    actions.move_to_element(cur_page).click().perform()
    # wait for the results to load
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//div[@class='row-fluid class-title']")))
    # wait for up to 5 seconds for the expand all classes to be clickable, then click it
    """expand_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id='expandAll']")))
    expand_button.click()"""
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//*[@id='expandAll']")))
    actions = ActionChains(driver)
    expand_button = driver.find_element_by_xpath("//*[@id='expandAll']")
    actions.move_to_element(expand_button).click().perform()
    # get and return all the status columns when they're loaded
    innerHTML = wait.until(EC.visibility_of_all_elements_located(
        (By.XPATH, "//div[@class='statusColumn']")))
    # give the HTML to the beautiful soup object
    innerHTML = driver.execute_script("return document.body.innerHTML")
    soup = BeautifulSoup(innerHTML, "html.parser")
    # this gets rid of all the discussion info
    for div in soup.find_all("div", {'class': 'secondarySection'}):
        div.decompose()

    # get the div for each of the classes
    all_classes = soup.find_all("div", class_="row-fluid class-title")
    for a in all_classes:
        # status is the enrollment status of the class, what we want
        status = a.find_all('div', class_="statusColumn")
        # class_name is the name of the current class
        class_name = a.find_all("h3", class_="head")
        # print out the class name
        for c in class_name:
            print(c.find('a').text)
        # print out the enrollment status for each of the lecs for the class
        for s in status:
            status_text = s.find('p').text
            if (status_text != "Status"):
                if (status_text.find('Closed') == 0):
                    print(0)
                    print(0)
                    closed_classes += 1
                if (status_text.find('Open') == 0):
                    number_text = re.findall("[0-9]+", status_text)
                    for i in number_text:
                        print(i + " ")
                    open_classes += 1
    page_num += 1

print("Open Classes " + str(open_classes))
print("Closed Classes " + str(closed_classes))
