#!/usr/bin/env node

import { execSync } from "child_process"
import _ from 'lodash'

const parseArgs = (args) => {
    return _.reduce(args, (ret, arg) => {
        const parsedArg = _.split(arg, '=')
        if (_.size(parsedArg) == 2) {
            const key = _.replace(parsedArg[0], /-+/, "")
            return {...ret, [key]: parsedArg[1]}
        }
        
        return ret
    }, {})
}

const config = parseArgs(process.argv.slice(2))
const generlateType = _.defaultTo(config.generator, "typescript-axios")
const url = _.defaultTo(config.url, "http://localhost:8001")
const output = _.defaultTo(config.output, "./gen")
const version = _.defaultTo(config.version, "v2")
const api = _.defaultTo(config.api, '')

const isCoreApi = api => _.includes(['v1', 'core'], api)
const isApiGroup = api => _.negate(isCoreApi)(api)

const input = _.cond([
    [_.matches({'version': 'v2'}), _.constant(`${url}/openapi/v2`)],
    [_.conforms({'api': isCoreApi}), _.constant(`${url}/openapi/v3/api/v1`)],
    [_.conforms({'api': isApiGroup}), _.constant(`${url}/openapi/v3/apis/${api}`)]
])({version, api})


console.log("Generated input:", input);

// OpenAPI Generator 실행
try {
  execSync(`openapi-generator-cli generate -g ${generlateType} -o ${output} -i ${input}`, { stdio: "inherit" });
} catch (error) {
  console.error("Failed to generate API client:", error.message);
  process.exit(1);
}
