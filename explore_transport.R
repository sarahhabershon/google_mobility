

read_in_transport <- read_csv("COVID-19-transport-use-statistics.csv", skip = 3) %>%
  mutate(date = as.Date(`Date\n[note 1]` , format = "%d-%b-%Y")) %>%
  rename(cars = `Cars\n[note 2]`)

car_traffic <- read_in_transport %>%
  select(date, cars) %>%
  mutate(cars = gsub("%", "", cars),
         cars = as.numeric(cars),
         cars = cars - 100) %>%
  arrange(date) %>%
  mutate(rollum = rollmean(cars, k = 7, fill = NA))


drive_time <- ggplot(car_traffic,
                     aes(x = date,
                         y = rollum)) +
  geom_line()

drive_time



merge_rollum <- home %>%
  filter(is.na(sub_region_1)) %>%
  select(date,
         retail_rec,
         grocery_pharm,
         parks,
         transit_stations,
         workplaces,
         residential) %>%
  left_join(car_traffic) %>%
  select(!rollum) %>%
  pivot_longer(!date, names_to = "place", values_to = "value") %>%
  arrange(date) %>%
  group_by(place) %>%
  mutate(rollum = rollmean(value, k = 7, fill = NA))


timeline_w_cars <- ggplot(merge_rollum %>%
                            drop_na() %>%
                            filter(place %in% c('cars', 'transit_stations', 'workplaces')),
                        aes(x = date,
                            y = rollum,
                            colour = place)) +
  geom_line()

timeline_w_cars
