const request = require('request-promise');
const urls = require('./demo-urls');
const blessed = require('blessed');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Task Queue Demo'
});

var table = blessed.table({
  top: 'top',
  left: 'left',
  width: '50%',
  height: '100%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'green',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  },
  data: [['jobId', 'state']]
});

screen.append(table);
screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

Promise.all(
  urls.map(url => {
    return request.post({
      uri: 'http://localhost:3000/job',
      body: {
        type: 'url',
        data: {
          title: `Url job: ${url}`,
          url
        }
      },
      json: true
    });
  })
).then(jobsCreated);

function jobsCreated(jobs1) {
  let jobsActive = true;
  let intervalId = setInterval(() => {
    const rows = [['jobId', 'state']];
    Promise.all(
      jobs1.map(job => {
        return request
          .get(`http://localhost:3000/job/${job.id}`, {
            json: true
          })
          .catch(error => {
            console.error('Error: ', error.message);
          });
      })
    ).then(jobs2 => {
      jobs2.forEach(body => {
        rows.push([body.id, body.state]);
      });
      //table.setData(rows);
      //screen.render();
      jobsActive = jobs2.some(body => {
        return body.state !== 'complete';
      });
      console.log(jobsActive);
      if (!jobsActive) {
        clearInterval(intervalId);
      }
    });
  }, 500);
}
