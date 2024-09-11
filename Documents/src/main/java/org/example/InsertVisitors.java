package org.example;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class InsertVisitors {
    public static void main(String[] args) {
        // Connect to MongoDB server
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017/");
        MongoDatabase database = mongoClient.getDatabase("visitor_management");

        MongoCollection<Document> visitorsCollection = database.getCollection("visitors");
        MongoCollection<Document> sessionsCollection = database.getCollection("visitor_sessions");
        MongoCollection<Document> groupsCollection = database.getCollection("visitor_groups");
        MongoCollection<Document> cardsCollection = database.getCollection("visitor_cards");
        MongoCollection<Document> usersCollection = database.getCollection("users");

        String imagePath = "C:/Users/PDAC-79/Downloads/Big_Image.jpg";
        String base64Image = ImageUtils.imageToBase64(imagePath);
        base64Image = "data:image/png;base64," + base64Image;

        Document userDocs = new Document()
                .append("username", "john")
                .append("password", "1234")
                .append("role", "admin");
        usersCollection.insertOne(userDocs);

        // Update existing card documents starting from card_id 103
        for (int i = 103; i <= 500; i++) {
            Document filter = new Document("card_id", i);
            Document update = new Document("$set", new Document("status", "available")
                    .append("assigned_to", null) // Set status to assigned and assigned_to to null
                    .append("last_assigned", new ArrayList<ObjectId>())); // Initialize empty array
            cardsCollection.updateOne(filter, update);
        }

        int cardId = 103;
        // Insert 9 more visitors with varying group sizes
        for (int i = 1; i <= 10; i++) {
            int groupSize = 1 + (i % 5); // Group sizes from 1 to 5

            // Insert visitor
            Document visitorDoc = new Document()
                    .append("name", "Visitor " + i)
                    .append("phone_number", "123456780" + i); // Adjust phone number for each visitor
            visitorsCollection.insertOne(visitorDoc);

            // Get inserted visitor ID
            ObjectId visitorId = visitorDoc.getObjectId("_id");

            // Insert group
            Document groupDoc = new Document()
                    .append("session_id", new ObjectId()) // Placeholder for session_id (to be updated later)
                    .append("group_members", new ArrayList<>());
            groupsCollection.insertOne(groupDoc);

            // Get inserted group ID
            ObjectId groupId = groupDoc.getObjectId("_id");

            // Insert session
            Document sessionDoc = new Document()
                    .append("_id", new ObjectId()) // Use a new ObjectId for session _id
                    .append("visitor_id", visitorId)
                    .append("purpose_of_visit", "Purpose" + i)
                    .append("entry_gate", "Gate " + (i % 2 == 0 ? "1" : "2"))
                    .append("check_in_time", new Date()) // Sample check-in time as Date
                    .append("exit_gate", "Gate " + (i % 2 == 0 ? "1" : "2"))
                    .append("check_out_time", i % 2 == 0 ? new Date() : null) // Null for unchecked out
                    .append("group_size", groupSize)
                    .append("group_id", groupId)
                    .append("photos", base64Image); // Empty string for photos

            sessionsCollection.insertOne(sessionDoc);

            // Update session_id in visitor_groups
            groupDoc.put("session_id", sessionDoc.getObjectId("_id"));
            groupsCollection.replaceOne(new Document("_id", groupId), groupDoc);

            // Insert group members
            List<Document> groupMembers = new ArrayList<>();
            for (int j = 0; j < groupSize; j++) {
                 // Adjust card ID starting from 103 and incrementing

                ObjectId groupMemberId = new ObjectId();

                // Insert group member
                Document groupMember = new Document()
                        .append("_id", groupMemberId)
                        .append("card_id", cardId)
                        .append("check_in_time", new Date()) // Sample check-in time as Date
                        .append("check_out_time", j % 2 == 0 ? new Date() : null) // Null for unchecked out
                        .append("status", j % 2 == 0 ? "checked_out" : "checked_in");
                groupMembers.add(groupMember);

                List<ObjectId> lastAssignedArray = new ArrayList<ObjectId>();
                if(j % 2 == 0) {
                    lastAssignedArray.add(groupMemberId);
                }
                // Update card status to assigned and assigned_to to null
                Document cardUpdate = new Document("$set", new Document("status", j % 2 == 0 ? "available" : "assigned")
                        .append("assigned_to", j % 2 == 0 ? null : groupMemberId)
                        .append("last_assigned", lastAssignedArray)); // Update last_assigned to single ObjectId
                cardsCollection.updateOne(new Document("card_id", cardId), cardUpdate);
                cardId++;
                System.out.println(cardId);
            }

            // Update group members in visitor_groups
            groupDoc.put("group_members", groupMembers);
            groupsCollection.replaceOne(new Document("_id", groupId), groupDoc);
        }

        // Close the MongoDB connection
        mongoClient.close();

        System.out.println("Successfully updated existing cards and inserted 9 visitors, sessions, and groups.");
    }
}
