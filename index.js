const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

// MongoDB connection URL
// const url = 'mongodb://localhost:27017';
const url = 'mongodb://127.0.0.1:27017';
// MongoDB database name
const dbName = 'test';
// MongoDB collection names
const collectionA = 'collectionA';
const collectionB = 'collectionB';

// File paths to save the generated data
const filePathA = 'data_collectionA.json';
const filePathB = 'data_collectionB.json';

// Generate sample data
function generateSampleData(sampleSize) {
  const dataA = [];
  const dataB = [];

  for (let i = 0; i < sampleSize; i++) {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber();
    const address = faker.address.streetAddress();
    const ssn = faker.datatype.number({ min: 100000000, max: 999999999 }).toString();
    var corrIdA = "";
    var corrIdB = "";
    // const createdTimestamp = new Date().toISOString(); 
    const createdTimestamp = new Date();

    const randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber < 40) {
      // If the random number is less than 40, assign the same corrId to both dataA and dataB
      corrIdA = corrIdB = uuidv4();
    }else {
      // Otherwise, generate different corrIds for dataA and dataB
      corrIdA = uuidv4();
      corrIdB = uuidv4();
    }

    dataA.push({ 
      // _id: {
      //   "$oid": new ObjectId().toString()
      // }, 
      corrId: corrIdA, 
      name: name, 
      email: email, 
      phone: phone, 
      address: address, 
      createdTimestamp: createdTimestamp
      // createdTimestamp: {
      //   "$date": createdTimestamp
      // }
     });
    dataB.push({ 
      // _id: {
      //   "$oid": new ObjectId().toString()
      // }, 
      corrId: corrIdB, 
      createdTimestamp: createdTimestamp
      // createdTimestamp: {
      //   "$date": createdTimestamp
      // }
     });
  }

  return { dataA, dataB };
}

// Save data to MongoDB
async function saveDataToMongoDB(data) {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    const collectionAData = db.collection(collectionA);
    const collectionBData = db.collection(collectionB);

    const resultA = await collectionAData.insertMany(data.dataA);
    console.log(`Inserted ${resultA.insertedCount} documents to Collection A`);

    const resultB = await collectionBData.insertMany(data.dataB);
    console.log(`Inserted ${resultB.insertedCount} documents to Collection B`);

    client.close();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Save data to a file
async function saveDataToFile(data, filePath) {
  const jsonData = JSON.stringify(data, null, 2);

  try {
    await fs.promises.writeFile(filePath, jsonData);
    console.log(`Data saved to ${filePath}`);
  } catch (err) {
    console.error(`Error writing data to file ${filePath}:`, err);
  }
}

// Generate sample data
const sampleSize = 1000;
const sampleData = generateSampleData(sampleSize);

// Save data to MongoDB and files
saveDataToMongoDB(sampleData);

saveDataToFile(sampleData.dataA, filePathA);
saveDataToFile(sampleData.dataB, filePathB);
