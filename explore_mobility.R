pacman::p_load(tidyverse,dplyr,ggplot2,readxl,zoo)

# read_in_global <- read_csv("Global_Mobility_Report.csv") %>%
#   rename(retail_rec = "retail_and_recreation_percent_change_from_baseline",
#          grocery_pharm = "grocery_and_pharmacy_percent_change_from_baseline",
#          parks = "parks_percent_change_from_baseline",
#          transit_stations = "transit_stations_percent_change_from_baseline",
#          workplaces = "workplaces_percent_change_from_baseline",
#          residential = "residential_percent_change_from_baseline")
#
# glimpse(read_in_global)

home <- read_in_global %>%
  filter(country_region_code == "GB")


#  Then-and-now

range <- c(max(read_in_global$date), min(read_in_global$date))

seq_1 <- seq(min(read_in_global$date), by = "day", length.out = 7)
seq_2 <- seq(max(read_in_global$date)-6, by = "day", length.out = 7)

compare_then_and_now <- home %>%
  mutate(range = ifelse(date %in% seq_1, "first_week",
                        ifelse(date %in% seq_2, "last_week", ""))) %>%
  filter(is.na(sub_region_1)) %>%
  select(date,
         retail_rec,
         grocery_pharm,
         parks,
         transit_stations,
         workplaces,
         residential,
         range) %>%
  pivot_longer(!c(date, range), names_to = 'place', values_to = 'value')

chart_then_and_now <- ggplot(compare_then_and_now %>%
                               filter(range %in% c("first_week", "last_week")) %>%
                               group_by(range, place) %>%
                               summarise(mean = mean(value)),
                             aes(x = place,
                                 y = mean)) +
  geom_col()+
  theme(axis.text.x = element_text(angle = 45)) +
  facet_wrap(~ range)

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
