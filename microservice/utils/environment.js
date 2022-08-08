const _ = require('lodash')

function read(key, defaultValue) {
    if (_.isNil(process.env[key])) {
        return defaultValue
    } else {
        return process.env[key]
    }
}

/**
 * @return {number}
 */
function num(key, defaultValue) {
    return Number(read(key, defaultValue))
}

/**
 * @return {boolean}
 */
function bool(key, defaultValue) {
    const value = read(key, defaultValue)
    if (!_.isNil(value)) {
        const stringValue = value.toString()
        if (['0', 'false'].includes(stringValue)) {
            return false
        }
        if (['1', 'true'].includes(stringValue)) {
            return true
        }
    }
    return defaultValue
}

/**
 * @return {string}
 */
function str(key, defaultValue) {
    const value = read(key, defaultValue)
    if (_.isNil(value)) {
        return ''
    }
    return value.toString()
}

function any(key, defaultValue) {
    return read(key, defaultValue)
}

function array(key, defaultValue) {
    const value = read(key, defaultValue)
    if (Array.isArray(value)) {
        return value
    }
    if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim())
    }
    return defaultValue
}

module.exports = {
    num,
    bool,
    str,
    any,
    array
}
