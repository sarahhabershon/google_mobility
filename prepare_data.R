pacman::p_load(tidyverse,dplyr,ggplot2,readxl,zoo,plotly,styler,jsonlite,anytime)


countries_to_compare <- c("GB", "NZ", "AU", "FR", "DE", "ES")

read_in_global <- read_csv("Global_Mobility_Report.csv") %>%
  rename(retail_rec = "retail_and_recreation_percent_change_from_baseline",
         grocery_pharm = "grocery_and_pharmacy_percent_change_from_baseline",
         parks = "parks_percent_change_from_baseline",
         transit_stations = "transit_stations_percent_change_from_baseline",
         workplaces = "workplaces_percent_change_from_baseline",
         residential = "residential_percent_change_from_baseline")

glimpse(read_in_global)

home <- read_in_global %>%
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

risk_index_in <- read_csv("https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/United%20Kingdom/OxCGRT_GBR_latest.csv") 


risk_index <- risk_index_in %>% 
  select(Date, RegionCode, StringencyIndex_Average_ForDisplay) %>%
  filter(is.na(RegionCode)) %>%
  mutate(date = anydate(Date))


home_long <-
  home %>%
  pivot_longer(!date, names_to = "place", values_to = "value") %>%
  select(place, date, value) %>%
  left_join(risk_index) %>%
  select(!c(RegionCode, Date))


write_csv(home_long, "GB_data_long.csv")




data_check <- ggplot(home_long,
                     aes(x = date,
                         y = value,
                         colour = place)) +
  geom_line()

data_check









#  Then-and-now - look at the last week in the dataset

range <- c(max(read_in_global$date), min(read_in_global$date))

seq_2 <- seq(max(read_in_global$date)-28, by = "day", length.out = 14)

compare_then_and_now <- read_in_global %>%
  filter(is.na(sub_region_1),
         # date %in% seq_2,
         country_region_code %in% countries_to_compare) %>%
  select(date,
         country_region,
         retail_rec,
         grocery_pharm,
         parks,
         transit_stations,
         workplaces,
         residential) %>%
  pivot_longer(!c(date, country_region), names_to = 'place', values_to = 'value') %>%
  group_by(country_region, place) %>%
  group_by(place) %>%
  mutate(rollum = rollmean(value, k = 7, fill = NA))


chart_then_and_now <- ggplot(compare_then_and_now %>%
                               filter(country_region == "Australia",
                                      place != "parks") %>%
                               mutate(x = place,
                                      id = row_number()),
                             aes(x = x,
                                 y = rollum,
                                 colour = place,
                                 frame = id)) +
  geom_bar(stat = "identity", position = "identity")
  # geom_hline(yintercept = 100) +
  # coord_polar()
  # facet_wrap(~ country_region)

# ggplotly(chart_then_and_now)



chart_then_and_now




# rolling mean

rollum <- home %>%
  filter(is.na(sub_region_1)) %>%
  select(date,
         retail_rec,
         grocery_pharm,
         parks,
         transit_stations,
         workplaces,
         residential) %>%
  pivot_longer(!date, names_to = "place", values_to = "value") %>%
  arrange(date) %>%
  group_by(place) %>%
  mutate(rollum = rollmean(value, k = 7, fill = NA))


timeline_roll <- ggplot(rollum,
                      aes(x = date,
                          y = rollum,
                          colour = place)) +
  geom_line()

timeline_roll






compare_work_transport <- read_in_global %>%
  filter(is.na(sub_region_1),
         country_region_code %in% countries_to_compare,
         date %in% seq_2) %>%
  select(date,
         country_region,
         workplaces,
         transit_stations) %>%
  group_by(country_region) %>%
  summarise(mean_work = mean(workplaces),
            mean_transit = mean(transit_stations))
# %>%
  # pivot_longer(!c(date, country_region), names_to = 'place', values_to = 'value') %>%
  # filter(place %in% c("transit_stations", "workplaces"))

compare_work_transit_chart <- ggplot(compare_work_transport,
                                     aes(x = mean_work,
                                         y = mean_transit,
                                         label = country_region)) +
  geom_point() +
  geom_text() +
  geom_vline(xintercept = 0) +
  geom_hline(yintercept = 0)

compare_work_transit_chart
