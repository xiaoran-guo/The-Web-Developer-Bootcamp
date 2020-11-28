# clear database
mongo yelp_camp_v11 --eval 'db.dropDatabase()'

# create collections and insert data
mongoimport --db yelp_camp_v11 --collection campgrounds < data/campgrounds.json
mongoimport --db yelp_camp_v11 --collection users < data/users.json

echo 'Database initialization finished!'
