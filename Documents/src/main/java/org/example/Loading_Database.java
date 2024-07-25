package org.example;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.types.ObjectId;

import javax.imageio.ImageIO;
import java.awt.FileDialog;
import java.awt.Frame;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Base64;

public class Loading_Database {

    public static void main(String[] args) {
        // Create a file dialog to choose an image file
        FileDialog fileDialog = new FileDialog((Frame) null, "Choose an Image File", FileDialog.LOAD);
        fileDialog.setFilenameFilter(new ImageFileFilter()); // Set filter to allow only image files
        fileDialog.setVisible(true);

        String imagePath = fileDialog.getFile(); // Get the selected file path
        if (imagePath == null) {
            System.out.println("No file selected. Exiting program.");
            System.exit(0);
        }

        // Construct full file path
        String imageDir = fileDialog.getDirectory();
        String fullImagePath = imageDir + imagePath;

        // Connect to MongoDB server
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017/");
        MongoDatabase database = mongoClient.getDatabase("visitor_management");

        // Get collections from the database
        MongoCollection<Document> visitorsCollection = database.getCollection("visitors");
        MongoCollection<Document> sessionsCollection = database.getCollection("visitor_sessions");
        MongoCollection<Document> groupsCollection = database.getCollection("visitor_groups");
        MongoCollection<Document> cardsCollection = database.getCollection("visitor_cards");
        MongoCollection<Document> usersCollection = database.getCollection("users");

        // Convert selected image to base64 format
        String base64Image = imageToBase64(fullImagePath);

        // Prepare card documents to be inserted
        List<Document> cardDocuments = new ArrayList<>();
        for (int i = 1; i <= 500; i++) {
            String formattedCardId = String.format("%03d", i); // Format card_id to always be three digits

            Document cardDoc = new Document()
                    .append("card_id", formattedCardId)
                    .append("status", "available")
                    .append("assigned_to", null) // Initially, the card is not assigned
                    .append("last_assigned", new ArrayList<ObjectId>()); // Initialize empty array
            cardDocuments.add(cardDoc);
        }
        cardsCollection.insertMany(cardDocuments); // Insert card documents into the collection

        // Insert a user document
        Document userDoc = new Document()
                .append("username", "john")
                .append("password", "1234")
                .append("role", "admin");
        usersCollection.insertOne(userDoc);

        // Update existing card documents starting from card_id 103
        Document updateQuery = new Document("$set", new Document("status", "available")
                .append("assigned_to", null)
                .append("last_assigned", new ArrayList<ObjectId>()));
        for (int i = 103; i <= 500; i++) {
            String formattedCardId = String.format("%03d", i);
            Document filter = new Document("card_id", formattedCardId);
            cardsCollection.updateOne(filter, updateQuery);
        }

        int cardId = 103;
        // Insert 9 visitors with varying group sizes
        for (int i = 1; i <= 9; i++) {
            int groupSize = 1 + (i % 5); // Group sizes from 1 to 5

            // Insert visitor
            Document visitorDoc = new Document()
                    .append("name", "Visitor " + i)
                    .append("phone_number", "123456780" + i);
            visitorsCollection.insertOne(visitorDoc);
            ObjectId visitorId = visitorDoc.getObjectId("_id");

            // Insert group
            Document groupDoc = new Document()
                    .append("session_id", new ObjectId()) // Placeholder for session_id (to be updated later)
                    .append("group_members", new ArrayList<Document>());
            groupsCollection.insertOne(groupDoc);
            ObjectId groupId = groupDoc.getObjectId("_id");

            // Insert session
            Document sessionDoc = new Document()
                    .append("_id", new ObjectId()) // Use a new ObjectId for session _id
                    .append("visitor_id", visitorId)
                    .append("purpose_of_visit", "Purpose " + i)
                    .append("entry_gate", "Gate " + (i % 2 == 0 ? "1" : "2"))
                    .append("check_in_time", new Date())
                    .append("exit_gate", "Gate " + (i % 2 == 0 ? "1" : "2"))
                    .append("check_out_time", i % 2 == 0 ? new Date() : null)
                    .append("group_size", groupSize)
                    .append("group_id", groupId)
                    .append("photos", base64Image); // Add base64Image here
            sessionsCollection.insertOne(sessionDoc);

            // Update session_id in visitor_groups
            groupDoc.put("session_id", sessionDoc.getObjectId("_id"));
            groupsCollection.replaceOne(new Document("_id", groupId), groupDoc);

            // Insert group members
            List<Document> groupMembers = new ArrayList<>();
            for (int j = 0; j < groupSize; j++) {
                ObjectId groupMemberId = new ObjectId();

                // Insert group member
                Document groupMember = new Document()
                        .append("_id", groupMemberId)
                        .append("card_id", String.format("%03d", cardId))
                        .append("check_in_time", new Date())
                        .append("exit_gate", (j % 2 == 0 ? (i % 2 == 0 ? "Gate 1" : "Gate 2") : null))
                        .append("check_out_time", j % 2 == 0 ? new Date() : null)
                        .append("status", j % 2 == 0 ? "checked_out" : "checked_in");
                groupMembers.add(groupMember);

                List<ObjectId> lastAssignedArray = new ArrayList<>();
                if (j % 2 == 0) {
                    lastAssignedArray.add(groupMemberId);
                }

                // Update card status
                Document cardUpdate = new Document("$set", new Document("status", j % 2 == 0 ? "available" : "assigned")
                        .append("assigned_to", j % 2 == 0 ? null : groupMemberId)
                        .append("last_assigned", lastAssignedArray));
                cardsCollection.updateOne(new Document("card_id", String.format("%03d", cardId)), cardUpdate);

                cardId++;
            }

            // Update group members in visitor_groups
            groupDoc.put("group_members", groupMembers);
            groupsCollection.replaceOne(new Document("_id", groupId), groupDoc);
        }

        // Integrate visitor_sessions update logic
        updateVisitorSessions(groupsCollection, sessionsCollection);

        // Close the MongoDB connection
        mongoClient.close();

        System.out.println("Successfully updated existing cards and inserted 9 visitors, sessions, and groups.");
        System.exit(0);
    }

    // Method to convert image to Base64
    private static String imageToBase64(String imagePath) {
        String base64Image = "";
        try {
            BufferedImage bufferedImage = ImageIO.read(new File(imagePath));
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "png", baos);
            baos.flush();
            byte[] imageBytes = baos.toByteArray();
            baos.close();
            base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64Image;
    }

    // FilenameFilter implementation to filter out non-image files
    static class ImageFileFilter implements FilenameFilter {
        @Override
        public boolean accept(File dir, String name) {
            String[] imageExtensions = {".png", ".jpg", ".jpeg"}; // Add more extensions if needed
            for (String extension : imageExtensions) {
                if (name.toLowerCase().endsWith(extension)) {
                    return true;
                }
            }
            return false;
        }
    }

    // Method to update visitor_sessions based on visitor_groups
    private static void updateVisitorSessions(MongoCollection<Document> groupsCollection,
                                              MongoCollection<Document> sessionsCollection) {
        List<Document> visitorGroups = groupsCollection.find().into(new ArrayList<>());

        for (Document group : visitorGroups) {
            ObjectId sessionId = group.getObjectId("session_id");
            if (sessionId == null) continue; // Skip if there's no session_id

            // Find all group members
            List<Document> groupMembers = (List<Document>) group.get("group_members");
            boolean allCheckedOut = true;
            Date latestCheckoutTime = null;
            String exitGate = null;

            for (Document member : groupMembers) {
                String status = member.getString("status");
                if (!"checked_out".equals(status)) {
                    allCheckedOut = false;
                }
                Date checkoutTime = member.getDate("check_out_time");
                                if (checkoutTime != null && (latestCheckoutTime == null || checkoutTime.after(latestCheckoutTime))) {
                    latestCheckoutTime = checkoutTime; // Update the latest checkout time
                }
                if (exitGate == null && member.getString("exit_gate") != null) {
                    exitGate = member.getString("exit_gate"); // Update the exit gate
                }
            }

            // Determine new check_out_time and exit_gate for the session
            Date newCheckOutTime = allCheckedOut ? latestCheckoutTime : null;
            String newExitGate = allCheckedOut ? exitGate : null;

            // Update the session document
            sessionsCollection.updateOne(
                    Filters.eq("_id", sessionId),
                    Updates.combine(
                            Updates.set("check_out_time", newCheckOutTime),
                            Updates.set("exit_gate", newExitGate)
                    )
            );
        }
    }
}
