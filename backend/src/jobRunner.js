const cron = require('node-cron');
const notifyGroupsWithLackOfVisits = require('./jobs/notifyGroupsWithLackOfVisits');

function startJobs() {
  cron.schedule('0 10 * * *', () => {
    notifyGroupsWithLackOfVisits();
  });
}

module.exports = { startJobs };
