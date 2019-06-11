const kue = require('kue');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'data/web-scraper.db', autoload: true });

const queue = kue.createQueue();
queue.watchStuckJobs();
queue.on('error', function(err) {
  console.error('Kue Error: ', err);
});

kue.app.get('/job/:id/result', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Fetching job result: ', id);
  db.findOne({ jobId: id }, (err, doc) => {
    if (err) return res.json({ error: err.message });
    res.json(doc);
  });
});

kue.app.listen(3000);
