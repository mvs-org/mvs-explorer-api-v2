export const REQUIRED_WALLET_VERSION = process.env.DNA_VOTE_REQUIRED_WALLET_VERSION || '0.8.5'

export const CURRENT_PERIOD = parseInt(process.env.DNA_VOTE_CURRENT_PERIOD, 10) || 0
export const REVOTE_ENABLED = process.env.DNA_REVOTE_ENABLED === 'true'
export const VOTE_ENABLED = process.env.DNA_VOTE_ENABLED === 'true'
export const VOTE_ENABLED_UNTIL = process.env.DNA_VOTE_ENABLED_UNTIL ? parseInt(process.env.DNA_VOTE_ENABLED_UNTIL, 10) : undefined
export const REVOTE_ENABLED_UNTIL = process.env.DNA_REVOTE_ENABLED_UNTIL ? parseInt(process.env.DNA_REVOTE_ENABLED_UNTIL, 10) : undefined

export const DNAVOTE_API_HOST = process.env.DNAVOTE_API_HOST || 'https://api.dna-election.com'
export const DNAVOTE_API_KEY = process.env.DNAVOTE_API_KEY || ''

export const REVOTE_AMOUNT_THRESHOLD = 1.2

export const INTERVAL_DNA_VOTE_ON_HOLD = (process.env.INTERVAL_DNA_VOTE_ON_HOLD) ? parseInt(process.env.INTERVAL_DNA_VOTE_ON_HOLD) : 0
export const INTERVAL_DNA_VOTE_EARLY_BIRD_START = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) : 3090000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_END = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_END) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_END) : 3152000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) : 3288270
export const INTERVAL_DNA_PREVIOUS_VOTE_END = (process.env.INTERVAL_DNA_PREVIOUS_VOTE_END) ? parseInt(process.env.INTERVAL_DNA_PREVIOUS_VOTE_END) : 3143806
export const CURRENT_PERIOD_REVOTE_START = (process.env.CURRENT_PERIOD_REVOTE_START) ? parseInt(process.env.CURRENT_PERIOD_REVOTE_START) : 3216000
export const CURRENT_PERIOD_REVOTE_END = (process.env.CURRENT_PERIOD_REVOTE_END) ? parseInt(process.env.CURRENT_PERIOD_REVOTE_END) : 3220000

export const SECONDARY_VOTE_ENABLED = process.env.SECONDARY_VOTE_ENABLED === 'true'
export const SECONDARY_ELECTION_START = (process.env.SECONDARY_ELECTION_START) ? parseInt(process.env.SECONDARY_ELECTION_START) : 3673600
export const SECONDARY_ELECTION_END = (process.env.SECONDARY_ELECTION_END) ? parseInt(process.env.SECONDARY_ELECTION_END) : 3685850
export const SECONDARY_VOTE_ENABLED_UNTIL = process.env.SECONDARY_VOTE_ENABLED_UNTIL ? parseInt(process.env.SECONDARY_VOTE_ENABLED_UNTIL, 10) : undefined
export const SECONDARY_VOTE_UNLOCK = (process.env.SECONDARY_VOTE_UNLOCK) ? parseInt(process.env.SECONDARY_VOTE_UNLOCK) : 3830403
export const PREVIOUS_SECONDARY_VOTE_END = (process.env.PREVIOUS_SECONDARY_VOTE_END) ? parseInt(process.env.PREVIOUS_SECONDARY_VOTE_END) : 3665300
export const SECONDARY_REVOTE_ENABLED = process.env.SECONDARY_REVOTE_ENABLED === 'true'
export const SECONDARY_ELECTION_REVOTE_START = (process.env.SECONDARY_ELECTION_REVOTE_START) ? parseInt(process.env.SECONDARY_ELECTION_REVOTE_START) : 3830403
export const SECONDARY_ELECTION_REVOTE_END = (process.env.SECONDARY_ELECTION_REVOTE_END) ? parseInt(process.env.SECONDARY_ELECTION_REVOTE_END) : 3665300
export const SECONDARY_REVOTE_ENABLED_UNTIL = process.env.SECONDARY_VOTE_ENABLED_UNTIL ? parseInt(process.env.SECONDARY_VOTE_ENABLED_UNTIL, 10) : undefined

export const ELECTION_PERIODS_UNLOCK = [3216000, 3288270, 3356586, 3424902, 3493218, 3561534]
export const ELECTION_PERIODS = [
    { start: 3085800, end: 3143806, revoteStart: 0, revoteEnd: 0 },
    { start: 3178750, end: 3227990, revoteStart: 3216000, revoteEnd: 3228037 },
    { start: 3232016, end: 3296690, revoteStart: 3288270, revoteEnd: 3296690 },
    { start: 3300200, end: 3365500, revoteStart: 3356580, revoteEnd: 3361000 },
    { start: 3368425, end: 3432967, revoteStart: 3424902, revoteEnd: 3428910 },
    { start: 3463380, end: 3501121, revoteStart: 3493218, revoteEnd: 3497226 },
    //...(VOTE_ENABLED ? [{ start: INTERVAL_DNA_VOTE_EARLY_BIRD_START, end: 9999999999, revoteStart: CURRENT_PERIOD_REVOTE_START, revoteEnd: CURRENT_PERIOD_REVOTE_END }] : []),
]

export const SECONDARY_ELECTION_PERIODS = [
    { start: 3673600, end: 3686000, revoteStart: 0, revoteEnd: 0 },
    { start: 3722000, end: 3843000, revoteStart: 3830650, revoteEnd: 3834650 },
    { start: 4043700, end: 4209500, revoteStart: 0, revoteEnd: 0 },
]