const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
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
    const ssn = faker.random.number({ min: 100000000, max: 999999999 }).toString();
    const corrId = uuidv4();
    // const createdTimestamp = new Date().toISOString(); 
    const createdTimestamp = new Date();

    dataA.push({ 
      _id: {
        "$oid": new ObjectId().toString()
      }, 
      corrId: corrId, 
      name: name, 
      email: email, 
      phone: phone, 
      address: address, 
      createdTimestamp: {
        "$date": createdTimestamp
      }
     });
    dataB.push({ 
      _id: {
        "$oid": new ObjectId().toString()
      }, 
      corrId: corrId, 
      createdTimestamp: {
        "$date": createdTimestamp
      }
     });
  }

  return { dataA, dataB };
}

// Save data to MongoDB
function saveDataToMongoDB(data) {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }

    const db = client.db(dbName);

    const collectionAData = db.collection(collectionA);
    const collectionBData = db.collection(collectionB);

    // Insert data to Collection A
    collectionAData.insertMany(data.dataA, (err, result) => {
      if (err) {
        console.error('Error inserting data to Collection A:', err);
      } else {
        console.log(`Inserted ${result.insertedCount} documents to Collection A`);
      }

      // Insert data to Collection B
      collectionBData.insertMany(data.dataB, (err, result) => {
        if (err) {
          console.error('Error inserting data to Collection B:', err);
        } else {
          console.log(`Inserted ${result.insertedCount} documents to Collection B`);
        }

        // Close the MongoDB connection
        client.close();

        // Save data to files
      });
    });
  });
}

// Save data to a file
function saveDataToFile(data, filePath) {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error(`Error writing data to file ${filePath}:`, err);
    } else {
      console.log(`Data saved to ${filePath}`);
    }
  });
}

// Generate sample data
const sampleSize = 1000;
const sampleData = generateSampleData(sampleSize);

// Save data to MongoDB and files
saveDataToMongoDB(sampleData);

saveDataToFile(sampleData.dataA, filePathA);
saveDataToFile(sampleData.dataB, filePathB);
