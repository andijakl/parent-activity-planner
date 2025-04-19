import { CosmosClient } from '@azure/cosmos';

// Set up Cosmos DB client, 
// In production, these would come from environment variables
const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT;
const key = import.meta.env.VITE_COSMOS_KEY;
const databaseId = import.meta.env.VITE_COSMOS_DATABASE_ID || 'ParentActivities';

const client = new CosmosClient({ endpoint, key });
let database: any;
let userContainer: any;
let activityContainer: any;
let invitationContainer: any;

export async function initializeCosmosDB() {
  try {
    // Create database if it doesn't exist
    const { database: db } = await client.databases.createIfNotExists({ id: databaseId });
    database = db;

    // Create containers if they don't exist
    const { container: users } = await database.containers.createIfNotExists({ id: 'users' });
    userContainer = users;

    const { container: activities } = await database.containers.createIfNotExists({ id: 'activities' });
    activityContainer = activities;

    const { container: invitations } = await database.containers.createIfNotExists({ id: 'invitations' });
    invitationContainer = invitations;

    console.log('Cosmos DB initialized');
  } catch (error) {
    console.error('Failed to initialize Cosmos DB:', error);
    throw error;
  }
}

// Generic function to get a container by name
export function getContainer(containerName: string) {
  switch (containerName) {
    case 'users':
      return userContainer;
    case 'activities':
      return activityContainer;
    case 'invitations':
      return invitationContainer;
    default:
      throw new Error(`Container ${containerName} not found`);
  }
}

// Generic CRUD operations
export async function createItem(containerName: string, item: any) {
  const container = getContainer(containerName);
  const { resource } = await container.items.create(item);
  return resource;
}

export async function getItem(containerName: string, id: string) {
  try {
    const container = getContainer(containerName);
    const { resource } = await container.item(id).read();
    return resource;
  } catch (error: any) {
    // Rethrow error with more context
    console.error(`Error getting item from ${containerName} with ID ${id}:`, error);
    if (error.code === 404 || error.message?.includes('404')) {
      throw new Error(`Item not found in ${containerName} with ID ${id}`);
    }
    throw error;
  }
}

export async function updateItem(containerName: string, id: string, item: any) {
  const container = getContainer(containerName);
  const { resource } = await container.item(id).replace(item);
  return resource;
}

export async function deleteItem(containerName: string, id: string) {
  const container = getContainer(containerName);
  await container.item(id).delete();
}

export async function queryItems(containerName: string, query: string, parameters: any[] = []) {
  const container = getContainer(containerName);
  const { resources } = await container.items.query({
    query,
    parameters
  }).fetchAll();
  return resources;
}