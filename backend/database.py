from pymongo import MongoClient

url = "mongodb+srv://2420110286_db_user:ImNano1234@cluster0.grqbr7a.mongodb.net/?appName=Cluster0"
client = MongoClient(url)

database = client["movie_booking"]

users_collection = database["users"]
movies_collection = database["movies"]
bookings_collection = database["bookings"]

client.admin.command("ping")
print("Connected to MongoDB successfully!")