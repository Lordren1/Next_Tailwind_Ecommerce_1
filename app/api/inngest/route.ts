import { inngest, syncUserCreated, syncUserDeleted, syncUserUpdated } from "@/app/config/inngest";
import { serve } from "inngest/next";
/* import { inngest } from "../../inngest/client"; */


//Create an API that serves zero functions, but is still able to receive events from Inngest. This is useful for testing and debugging.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreated,
    syncUserUpdated,
    syncUserDeleted 
  ],
});