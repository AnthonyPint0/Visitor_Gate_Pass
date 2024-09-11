package org.example;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.client.model.Filters; // Import Filters from MongoDB Java driver
import org.bson.types.ObjectId;
import org.example.ImageUtils;

import java.util.Date;

public class InsertSession {
    public static void main(String[] args) {
        // Connect to MongoDB server
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017/");
        MongoDatabase database = mongoClient.getDatabase("visitor_management");
        MongoCollection<Document> sessionsCollection = database.getCollection("visitor_sessions");

        // Example Base64 encoded image (replace with actual Base64 string)
        String imagePath = "C:/Users/PDAC-79/Downloads/Big_Image.jpg";
        String base64Image = ImageUtils.imageToBase64(imagePath);
        base64Image = "data:image/png;base64," + base64Image;

//        // Update all documents in sessions collection with the new photos field
//        Document updateDoc = new Document("$set", new Document("photos", base64Image));
//        sessionsCollection.updateMany(Filters.exists("_id"), updateDoc);

        // Close the MongoDB connection
        mongoClient.close();
        System.out.println(base64Image);
    }
}
