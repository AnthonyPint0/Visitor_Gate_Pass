package org.example;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class Main{
    public static void main(String[] args) {
        // Connect to MongoDB server
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017/");
        MongoDatabase database = mongoClient.getDatabase("visitor_management");
        MongoCollection<Document> collection = database.getCollection("visitor_cards");

        // Prepare the documents to be inserted
        List<Document> documents = new ArrayList<>();
        for (int i = 1; i <= 500; i++) {
            Document doc = new Document()
                    .append("card_id", i)
                    .append("status", "available")
                    .append("assigned_to", null) // assigned_to is null since the card is available
                    .append("last_assigned", new ArrayList<ObjectId>()); // Initialize empty array
            documents.add(doc);
        }

        // Insert the documents into the collection
        collection.insertMany(documents);

        // Close the MongoDB connection
        mongoClient.close();

        System.out.println("Successfully inserted 500 documents into the visitor_cards collection.");
    }
}
