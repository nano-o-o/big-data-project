from database import movies_collection
from pymongo.errors import BulkWriteError

movies_collection.create_index("title", unique=True)
print("Unique index created for movies!")

movies = [
    {
        "title": "The Avengers",
        "genre": ["Action", "Sci-Fi"],
        "duration": 143,
        "showtimes": ["11:00", "18:00"]
    },
    {
        "title": "Avengers: Age of Ultron",
        "genre": ["Action", "Sci-Fi"],
        "duration": 141,
        "showtimes": ["12:00", "19:00"]
    },
    {
        "title": "Avengers: Infinity War",
        "genre": ["Action", "Sci-Fi"],
        "duration": 149,
        "showtimes": ["13:00", "20:00"]
    },
    {
        "title": "Avengers: Endgame",
        "genre": ["Action", "Sci-Fi"],
        "duration": 181,
        "showtimes": ["14:00", "21:00"]
    }
]

try:
    movies_collection.insert_many(movies, ordered=False)
    print("Movies inserted successfully!") 
except BulkWriteError:
    print("Some movies already existed, duplicates skipped.")