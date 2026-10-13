import { clerkClient } from "@clerk/nextjs/server";

const authSeller = async (userId) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const isSeller = user?.publicMetadata?.role === "seller";
    return isSeller;
  } catch (error) {
    console.error("authSeller error:", error);
    return false;
  }
};

export default authSeller;
