const superagent = require('superagent')
const chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should()
chai.use(chaiAsPromised);

const API_V2 = 'https://explorer.mvs.org/api/v2/'

describe('Election Mainnet', function () {
    describe('Revotes', () => {
        it('Invalid transaction', () => getRevoteCount('abc')
            .should.be.rejected
        )
        it('No vote transaction', () => getRevoteCount('2a845dfa63a7c20d40dbc4b15c3e970ef36332b367500fd89307053cb4c1a2c1')
            .should.become(0)
        )
        it('Simple vote', () => getRevoteCount('753a1ae13b9ce6483f9ffb08847f5451ec4abef2fc42bdc311b8ef553613f788')
            .should.become(1)
        )
        it('Simple revote of simple vote', () => getRevoteCount('12400c2f66e4f46802c89557e2b67cc1815d6fcafaba8f373d71ba3a928ea7af')
            .should.become(4)
        )
    })
})

async function getRevoteCount(hash) {
    const apiResponse = await superagent.get(API_V2 + 'election/revote/' + hash)
    return apiResponse.body.revoteCount
}