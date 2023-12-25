import Prompt from "@models/prompt";
import { connectedToDB } from "@utils/database";

export const GET = async (req) => {
  try {
    await connectedToDB();

    const prompts = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
