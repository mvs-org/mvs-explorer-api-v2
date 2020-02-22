const superagent = require('superagent')
const chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should()
chai.use(chaiAsPromised);

const API_V2 = 'https://explorer-testnet.mvs.org/api/v2/'

describe('Election Testnet', function () {
    describe('Revotes', () => {
        it('Invalid transaction', () => getRevoteCount('abc')
            .should.be.rejected
        )
        it('No vote transaction', () => getRevoteCount('d4d612297cbecbc2d6438403e751ca83b3eedc58966033016e52889a9a86062e')
            .should.become(0)
        )
        it('Simple vote', () => getRevoteCount('f68a5a5c29ff7c50ad78f5b54eb5d5baaabc02a7c6895efb468570d4b3a3d69e')
            .should.become(1)
        )
        it('Simple revote of simple vote', () => getRevoteCount('d98b7534190ed5c67c6cf7108c39516c21e532a518f26f3b0e1e1fe8aa76ff7d')
            .should.become(2)
        )
    })
})

async function getRevoteCount(hash) {
    const apiResponse = await superagent.get(API_V2 + 'election/revote/' + hash)
    return apiResponse.body.revoteCount
}