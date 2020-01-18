export const REQUIRED_WALLET_VERSION = process.env.DNA_VOTE_REQUIRED_WALLET_VERSION || '0.8.5'

export const CURRENT_PERIOD = parseInt(process.env.DNA_VOTE_CURRENT_PERIOD, 10) || 0
export const REVOTE_ENABLED = process.env.DNA_REVOTE_ENABLED === 'true'
export const VOTE_ENABLED = process.env.DNA_VOTE_ENABLED === 'true'
export const VOTE_ENABLED_UNTIL = process.env.DNA_VOTE_ENABLED_UNTIL ? parseInt(process.env.DNA_VOTE_ENABLED_UNTIL, 10) : undefined
export const REVOTE_ENABLED_UNTIL = process.env.DNA_REVOTE_ENABLED_UNTIL ? parseInt(process.env.DNA_REVOTE_ENABLED_UNTIL, 10) : undefined

export const DNAVOTE_API_HOST = process.env.DNAVOTE_API_HOST || 'https://www.dnavote.com'
export const DNAVOTE_API_KEY = process.env.DNAVOTE_API_KEY || ''

export const REVOTE_AMOUNT_THRESHOLD = 1.2

export const INTERVAL_DNA_VOTE_ON_HOLD = (process.env.INTERVAL_DNA_VOTE_ON_HOLD) ? parseInt(process.env.INTERVAL_DNA_VOTE_ON_HOLD) : 0
export const INTERVAL_DNA_VOTE_EARLY_BIRD_START = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) : 3090000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_END = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_END) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_END) : 3152000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) : 3288270
export const INTERVAL_DNA_PREVIOUS_VOTE_END = (process.env.INTERVAL_DNA_PREVIOUS_VOTE_END) ? parseInt(process.env.INTERVAL_DNA_PREVIOUS_VOTE_END) : 3143806
export const CURRENT_PERIOD_REVOTE_START = (process.env.CURRENT_PERIOD_REVOTE_START) ? parseInt(process.env.CURRENT_PERIOD_REVOTE_START) : 3216000
export const CURRENT_PERIOD_REVOTE_END = (process.env.CURRENT_PERIOD_REVOTE_END) ? parseInt(process.env.CURRENT_PERIOD_REVOTE_END) : 3220000

export const ELECTION_PERIODS_UNLOCK = [2390000, 2450000, 2510000, 2570000, 2630000, 2690000, 2750000]
export const ELECTION_PERIODS = [
    { start: 2220000, end: 2270000, revoteStart: 0, revoteEnd: 0 },
    { start: 2280000, end: 2450000, revoteStart: 2320000, revoteEnd: 2450000 },
    //...(VOTE_ENABLED ? [{ start: INTERVAL_DNA_VOTE_EARLY_BIRD_START, end: 9999999999, revoteStart: CURRENT_PERIOD_REVOTE_START, revoteEnd: CURRENT_PERIOD_REVOTE_END }] : []),
]