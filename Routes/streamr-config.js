const StreamrClient = require('streamr-client')

 module.exports = client = new StreamrClient({
    auth: {
        privateKey: process.env.STREAMR_PKEY,
    },
    url: 'wss://hack.streamr.network/api/v1/ws',
    restUrl: 'https://hack.streamr.network/api/v1',
})

client.joinDataUnion(process.env.DU_CONTRACT, process.env.SHARED_SECRET)
.then(memberDetails => {
  console.log('Joined data union ', memberDetails)
})
.catch(err => {
  console.log('There was some error while joining data union ', err)
})