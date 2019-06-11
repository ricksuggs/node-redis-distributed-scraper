### Node Redis Distributed Scraper

This project is a proof of concept distributed task web scraper built with JavaScript libraries.
This project was created with Ubuntu 16.04.6 LTS and NodeJS v10.15.3 and has not been tested with any other versions.

#### Technologies:

- redis - queue backend
- nedb - persistent storage for job results
- kue - nodejs distributed queue library
- pm2 - nodejs process manager, allows you to configure multiple worker processes

#### Architecture

Kue is a redis backed distributed task queue. A master process is only needed to instantiate the REST api.
Multiple workers can be started concurrently. In this POC, `pm2` manages the processes.

A url is processed by sending a `POST` request to the REST api (see example below). As the workers process
the messages from the queue, each url is fetched and the response body is stored in the `nedb` database.

The job results can be fetched through a custom API endpoint, given that the job state is `complete`.

#### Other Dependencies:

- redis-server
  - `sudo apt-get install redis-server`
  - `sudo service redis-server start`
  - If you have docker installed: `docker-compose up -d`

#### Scripts:

- Install JavaScript dependencies: `yarn install`
- Start a master process and as many worker processes as your machine's CPUs: `yarn start`
- Push 92 urls onto the queue as jobs: `node ./scripts/demo-create-jobs.js`
  - (use Ctrl+C to exit this process after all jobs are complete)
- Fetch a sample result after all of the jobs are processed: `node ./scripts/demo-fetch-result.js`
- Cleanup jobs: `node ./scripts/cleanup-jobs.js`
- Shutdown all workers and master process: `yarn stop`

#### Logging:

pm2 creates log files for each process in `~/.pm2/logs`

Flush the logs with the following command: `yarn flush`

#### Job UI:

Kue ships with a web dashboard to view jobs by status at http://localhost:3000

#### API:

The REST API is included in the Kue library, but one additional endpoint has been added to fetch the job result from nedb

##### Create a job:

- Request:

  ```javascript
  request.post({
    uri: "http://localhost:3000/job",
    body: {
      type: "url",
      data: {
        title: `Url job: ${url}`,
        url
      }
    },
    json: true
  });
  ```

- Response:

  ```json
  {
    "id": 1,
    "state": "active"
  }
  ```

##### Check a job's status:

- Request:

  ```javascript
  request.get({
    uri: "http://localhost:3000/job/:id",
    json: true
  });
  ```

- Response:

  ```json
  {
    "id": 1,
    "state": "active"
  }
  ```

##### Fetch the job's result:

- Request:

  ```javascript
  request.get({
    uri: "http://localhost:3000/job/:id/result",
    json: true
  });
  ```

- Response:

  ```json
  {
    "responseBody": "<!doctype...>",
    "jobId": 1,
    "indexDate": "2019-06-11T03:32:53.711Z",
    "_id": "DJ38F4jKtWuAFuim"
  }
  ```
