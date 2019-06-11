const request = require('request-promise');

request
  .get('http://localhost:3000/jobs/complete/0..1/asc', { json: true })
  .then(jobs => {
    for (let job of jobs) {
      request
        .get(`http://localhost:3000/job/${job.id}/result`, { json: true })
        .then(jobResult => {
          console.log(jobResult);
        })
        .catch(error => {
          console.error('Error: ', error.message);
        });
    }
  })
  .catch(error => {
    console.error('Error: ', error.message);
  });
