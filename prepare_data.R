pacman::p_load(tidyverse,dplyr,ggplot2,readxl,anytime)


read_in_global <- read_csv("Global_Mobility_Report.csv") %>%
  rename(retail_rec = "retail_and_recreation_percent_change_from_baseline",
         grocery_pharm = "grocery_and_pharmacy_percent_change_from_baseline",
         parks = "parks_percent_change_from_baseline",
         transit_stations = "transit_stations_percent_change_from_baseline",
         workplaces = "workplaces_percent_change_from_baseline",
         residential = "residential_percent_change_from_baseline")

glimpse(read_in_global)



gb_data <- read_in_global %>%
  filter(is.na(sub_region_1),
        country_region_code == "GB") %>%
  select(date, transit_stations, workplaces, grocery_pharm, residential, retail_rec) %>%
  mutate("Transit stations" = rollmean(100+transit_stations, k = 7, fill = NA),
         "Workplaces" = rollmean(100+workplaces, k = 7, fill = NA),
         "Retail & recreation" = rollmean(100+retail_rec, k = 7, fill = NA),
         "Grocery & pharmacy" = rollmean(100+grocery_pharm, k = 7, fill = NA),
         "Residential" = rollmean(100+residential, k = 7, fill = NA)) %>%
  drop_na() %>%
  select(!c(transit_stations, workplaces, grocery_pharm, residential, retail_rec))


# Import risk index and match by date

risk_index_in <- read_csv("https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/United%20Kingdom/OxCGRT_GBR_latest.csv") 


risk_index <- risk_index_in %>% 
  select(Date, RegionCode, StringencyIndex_Average_ForDisplay) %>%
  filter(is.na(RegionCode)) %>%
  mutate(date = anydate(Date))


gb_data_long <- gb_data %>%
  pivot_longer(!date, names_to = "place", values_to = "value") %>%
  select(place, date, value) %>%
  left_join(risk_index) %>%
  select(!c(RegionCode, Date))


# Chart to see data shape
data_check <- ggplot(gb_data_long,
                     aes(x = date,
                         y = value,
                         colour = place)) +
  geom_line()

data_check


write_csv(gb_data_long, "GB_data_long.csv")







