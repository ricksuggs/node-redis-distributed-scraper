### Node Redis Distributed Scraper

This project was created with Ubuntu 16.04.6 LTS and NodeJS v10.15.3 and has not been tested with any other versions.

This project is a proof of concept distributed task web scraper built with JavaScript libraries

#### Technologies:

- redis - queue backend
- nedb - persistent storage for job results
- kue - nodejs distributed queue library
- pm2 - nodejs process manager, allows you to configure multiple worker processes

#### Other Dependencies:

- redis-server
  - `sudo apt-get install redis-server`
  - `sudo service redis-server start`

#### Scripts:

- Install JavaScript dependencies: `yarn install`
- Start the master process, with 4 worker processes: `yarn start`
- Push some urls onto the queue as jobs: `node ./scripts/demo-create-jobs.js`
- Fetch a sample result after all of the jobs are processed: `node ./scripts/demo-fetch-result.js`
- Cleanup jobs: `node ./scripts/cleanup-jobs.js`

#### API:

The REST API is included in the Kue library, but one additional endpoint has been added to fetch the job result from nedb

##### Create a job:

- Request:

    ```javascript
    request.post({
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
        uri: 'http://localhost:3000/job/:id',
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
        uri: 'http://localhost:3000/job/:id/result',
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
