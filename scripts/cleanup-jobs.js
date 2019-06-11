const request = require('request-promise');

request
  .get('http://localhost:3000/jobs/0..50/asc', { json: true })
  .then(jobs => {
    for (let job of jobs) {
      request
        .delete(`http://localhost:3000/job/${job.id}`)
        .then(() => {
          console.log('deleted: ', job.id);
        })
        .catch(error => {
          console.log('Error: ', error.message);
        });
    }
  })
  .catch(error => {
    console.error('Error: ', error.message);
  });
