from database import users_collection

def create_user(name, email, phone):
    # check if user already exist
    existing_user = users_collection.find_one({"email": email})
    
    if existing_user:   
        return str(existing_user["_id"])
    
    # otherwise create new user
    result = users_collection.insert_one({
        "name": name,
        "email": email,
        "phone": phone
    })
    
    return str(result.inserted_id)