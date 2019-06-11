const kue = require('kue');
const Datastore = require('nedb');
const request = require('request-promise');

const db = new Datastore({ filename: 'data/web-scraper.db', autoload: true });
const queue = kue.createQueue();

queue.process('url', (job, done) => {
  console.log(`Processing job: ${job.id}`);
  console.log(`Sending request for url: ${job.data.url}`);

  request
    .get(`http://${job.data.url}`)
    .then(body => {
      const doc = {
        reponseBody: body,
        jobId: job.id,
        indexDate: new Date()
      };
      db.insert(doc, function(error, newDoc) {
        console.log(`Document inserted with id: ${newDoc._id}`);
        done();
      });
    })
    .catch(error => {
      console.error('Error: ', error.message);
    });
});
