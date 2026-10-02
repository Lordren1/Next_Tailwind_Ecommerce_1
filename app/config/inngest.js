// src/inngest/client.ts
import User from "@/models/User";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "e-commerce" });

// Handle user creation to save user data to database
export const syncUserCreated = inngest.createFunction(
  {id: "sync-clerk-user-created"},
  {event: "clerk/user.created"},
  async ({event}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
  
    }

    await dbConnection(); // Ensure database connection is established
    await User.create(userData);
  }
);

// Sync updated Clerk user data into the MongoDB
export const syncUserUpdated = inngest.createFunction(
  {id: "sync-clerk-user-updated"},
  {event: "clerk/user.updated"},
  async ({event}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };

    await dbConnection(); // Ensure database connection is established
    await User.findByIdAndUpdate(id, userData);
  }
);

// Sync user deletion from Clerk to MongoDB
export const syncUserDeleted = inngest.createFunction(
  {id: "sync-clerk-user-deleted"},
  {event: "clerk/user.deleted"},
  async ({event}) => {
    const {id} = event.data;

    await dbConnection(); // Ensure database connection is established
    await User.findByIdAndDelete(id);
  }
);