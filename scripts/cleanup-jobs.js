const kue = require('kue');
const queue = kue.createQueue();

kue.Job.rangeByState('complete', 0, 50, 'asc', (err, jobs) => {
  if (err) {
    console.error('Error: ', err.message);
    return;
  }

  for (let job of jobs) {
    kue.Job.remove(job.id, () => {
      console.log('removed ', job.id);
    });
  }
});