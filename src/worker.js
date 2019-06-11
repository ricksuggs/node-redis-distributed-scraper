const kue = require('kue');
const sqlite3 = require('better-sqlite3');
const request = require('request-promise');

const db = sqlite3('data/web-scraper.db');

const queue = kue.createQueue();

queue.process('url', (job, done) => {
  console.log(`Processing job: ${job.id}`);
  console.log(`Sending request for url: ${job.data.url}`);

  request
    .get(`http://${job.data.url}`)
    .then(body => {
      const statement = db.prepare(
        'INSERT INTO results (job_id, response_body) VALUES (?, ?)'
      );
      statement.run(job.id, body);
      done();
    })
    .catch(error => {
      console.error('Error: ', error.message);
    });
});
