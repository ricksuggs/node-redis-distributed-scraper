const request = require('request-promise');
const kue = require('kue');
kue.createQueue();

kue.Job.rangeByState('complete', 0, 1, 'asc', (err, jobs) => {
  if (err) {
    console.error('Error: ', err.message);
    return;
  }

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
});
