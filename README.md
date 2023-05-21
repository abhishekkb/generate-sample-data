# Sample Data Generation and Storage to MongoDB

This JavaScript code generates sample data for Collection A and Collection B using the Faker library and stores the generated data in MongoDB. The script connects to a local MongoDB server and inserts the data into the respective collections.

Correlation Id commonality between these two collection is kept at 40%. It will generate sample data and insert it into the respective collections (Collection A and Collection B) in your local MongoDB database, with approximately 40% of the time having the same corrId in both collections.

## Prerequisites

- Node.js installed on your system
- MongoDB installed and running on your local machine

## Installation

1. Clone this repository or download the JavaScript file.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the required dependencies:

   ```bash
   npm install
