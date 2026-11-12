import { Client, Databases, ID, Query } from "react-native-appwrite";

// Environment variables
const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const commentsCollectionId =
  process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID!;

// Appwrite client
const client = new Client().setEndpoint(endpoint).setProject(projectId);

const databases = new Databases(client);

// Story type
export type Story = {
  $id: string;
  title: string;
  category: string;
  emoji: string;
  color: string;
  imageUrl?: string;
  writerName: string;
  story: string;
  $createdAt: string;
};

// Comment type
export type StoryComment = {
  $id: string;
  storyId: string;
  name: string;
  text: string;
  createdAt: string;
};

// Create story
export async function createStory(data: {
  title: string;
  category: string;
  emoji: string;
  color: string;
  imageUrl?: string;
  writerName: string;
  story: string;
}) {
  return databases.createDocument({
    databaseId,
    collectionId,
    documentId: ID.unique(),
    data,
  });
}

// Update story
type StoryUpdate = Partial<
  Pick<
    Story,
    | "title"
    | "category"
    | "emoji"
    | "color"
    | "imageUrl"
    | "writerName"
    | "story"
  >
>;

export async function updateStory(
  id: string,
  data: StoryUpdate,
): Promise<Story> {
  const result = await databases.updateDocument({
    databaseId,
    collectionId,
    documentId: id,
    data,
  });

  return result as unknown as Story;
}

// Delete story
export async function deleteStory(id: string): Promise<void> {
  await databases.deleteDocument({
    databaseId,
    collectionId,
    documentId: id,
  });
}

// Get all stories
export async function getStories(): Promise<Story[]> {
  const result = await databases.listDocuments({
    databaseId,
    collectionId,
    queries: [Query.orderDesc("$createdAt"), Query.limit(100)],
  });

  return result.documents as unknown as Story[];
}

// Get one story
export async function getStory(id: string): Promise<Story> {
  const result = await databases.getDocument({
    databaseId,
    collectionId,
    documentId: id,
  });

  return result as unknown as Story;
}

// Get comment count
export async function getStoryCommentCount(storyId: string): Promise<number> {
  const result = await databases.listDocuments({
    databaseId,
    collectionId: commentsCollectionId,
    queries: [Query.equal("storyId", storyId), Query.limit(1)],
  });

  return result.total;
}

// Get comments
export async function getStoryComments(
  storyId: string,
): Promise<StoryComment[]> {
  const result = await databases.listDocuments({
    databaseId,
    collectionId: commentsCollectionId,
    queries: [
      Query.equal("storyId", storyId),
      Query.orderDesc("createdAt"),
      Query.limit(100),
    ],
  });

  return result.documents as unknown as StoryComment[];
}

// Add comment
export async function addStoryComment(
  storyId: string,
  text: string,
  name: string,
): Promise<StoryComment> {
  const cleanName = name.trim();
  const cleanText = text.trim();

  if (!cleanName || cleanName.length > 40) {
    throw new Error("Name must be between 1 and 40 characters.");
  }

  if (!cleanText || cleanText.length > 1000) {
    throw new Error("Comment must be between 1 and 1000 characters.");
  }

  const result = await databases.createDocument({
    databaseId,
    collectionId: commentsCollectionId,
    documentId: ID.unique(),
    data: {
      storyId,
      name: cleanName,
      text: cleanText,
      createdAt: new Date().toISOString(),
    },
  });

  return result as unknown as StoryComment;
}
