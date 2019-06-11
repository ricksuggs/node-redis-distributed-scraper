const kue = require('kue');
const sqlite3 = require('better-sqlite3');

const db = sqlite3('data/web-scraper.db');

const statement = db.prepare(`CREATE TABLE IF NOT EXISTS results(
    id INTEGER PRIMARY KEY,
    job_id INT,
    response_body TEXT
  )`);
statement.run();

const queue = kue.createQueue();
queue.watchStuckJobs();
queue.on('error', function(err) {
  console.error('Kue Error: ', err);
});

kue.app.get('/job/:id/result', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('Fetching job result: ', id);

  const statement = db.prepare('SELECT * FROM results WHERE job_id = ?');
  const row = statement.get(id);
  res.json(row);
});

kue.app.listen(3000);
